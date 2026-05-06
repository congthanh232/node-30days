import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'
import CoursePolicy from '#policies/course_policy'

@inject()
export default class CoursesController {
  /**
   * Lấy danh sách tất cả courses — public
   */
  async index({ serialize }: HttpContext) {
    const courses = await Course.query().preload('teacher').orderBy('created_at', 'desc')
    return serialize({ courses })
  }

  /**
   * Lấy chi tiết 1 course kèm lessons — public
   */
  async show({ params, serialize }: HttpContext) {
    const course = await Course.query()
      .where('id', params.id)
      .preload('teacher')
      .preload('lessons')
      .firstOrFail()
    return serialize({ course })
  }

  /**
   * Tạo course mới — chỉ instructor
   */
  async store({ request, auth, bouncer, serialize }: HttpContext) {
    await bouncer.with(CoursePolicy).authorize('create')

    const user = auth.getUserOrFail()
    const data = request.only(['title', 'description', 'price'])

    const course = await Course.create({
      ...data,
      teacherId: user.id,
    })

    return serialize({ course })
  }

  /**
   * Cập nhật course — chỉ instructor sở hữu course
   */
  async update({ params, request, bouncer, serialize }: HttpContext) {
    const course = await Course.findOrFail(params.id)
    await bouncer.with(CoursePolicy).authorize('edit', course)

    const data = request.only(['title', 'description', 'price', 'status'])
    await course.merge(data).save()

    return serialize({ course })
  }

  /**
   * Xóa course — chỉ instructor sở hữu course
   */
  async destroy({ params, bouncer }: HttpContext) {
    const course = await Course.findOrFail(params.id)
    await bouncer.with(CoursePolicy).authorize('delete', course)

    await course.delete()
    return { message: 'Course deleted successfully' }
  }
}
