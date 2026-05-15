import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'
import Lesson from '#models/lesson'
import LessonPolicy from '#policies/lesson_policy'
import { createLessonValidator, updateLessonValidator } from '#validators/lesson'

@inject()
export default class LessonsController {
  /**
   * Lấy danh sách lessons của course — public
   */
  async index({ params, serialize }: HttpContext) {
    const course = await Course.findOrFail(params.course_id)

    const lessons = await Lesson.query().where('course_id', course.id).orderBy('order', 'asc')

    return serialize({ lessons })
  }

  /**
   * Lấy chi tiết 1 lesson — public
   */
  async show({ params, serialize }: HttpContext) {
    const lesson = await Lesson.query()
      .where('id', params.id)
      .where('course_id', params.course_id)
      .firstOrFail()

    return serialize({ lesson })
  }

  /**
   * Tạo lesson mới — chỉ instructor sở hữu course
   */
  async store({ params, request, bouncer, serialize }: HttpContext) {
    const course = await Course.findOrFail(params.course_id)
    await bouncer.with(LessonPolicy).authorize('create', course)

    const data = await request.validateUsing(createLessonValidator)

    // Nếu không truyền order → tự động đặt sau lesson cuối cùng
    let order = data.order
    if (!order) {
      const lastLesson = await Lesson.query()
        .where('course_id', course.id)
        .orderBy('order', 'desc')
        .first()
      order = lastLesson ? lastLesson.order + 1 : 1
    }

    const lesson = await Lesson.create({
      ...data,
      order,
      courseId: course.id,
    })

    return serialize({ lesson })
  }

  /**
   * Cập nhật lesson — chỉ instructor sở hữu course
   */
  async update({ params, request, bouncer, serialize }: HttpContext) {
    const lesson = await Lesson.query()
      .where('id', params.id)
      .where('course_id', params.course_id)
      .firstOrFail()

    await bouncer.with(LessonPolicy).authorize('edit', lesson)

    const data = await request.validateUsing(updateLessonValidator)
    await lesson.merge(data).save()

    return serialize({ lesson })
  }

  /**
   * Xóa lesson — chỉ instructor sở hữu course
   */
  async destroy({ params, bouncer }: HttpContext) {
    const lesson = await Lesson.query()
      .where('id', params.id)
      .where('course_id', params.course_id)
      .firstOrFail()

    await bouncer.with(LessonPolicy).authorize('delete', lesson)

    await lesson.delete()
    return { message: 'Lesson deleted successfully' }
  }
}
