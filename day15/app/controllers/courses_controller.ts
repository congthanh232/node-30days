import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'
import CoursePolicy from '#policies/course_policy'
import { createCourseValidator, updateCourseValidator } from '#validators/course'
import CourseTransformer from '#transformers/course_transformer'

@inject()
export default class CoursesController {
  /**
   * Lấy danh sách tất cả courses — public, có pagination + filter
   */
  async index({ request, serialize }: HttpContext) {
    const page = request.input('page', 1) // trang hiện tại, default 1
    const limit = request.input('limit', 10) // số item mỗi trang, default 10
    const status = request.input('status') // filter theo status
    const search = request.input('search') // tìm kiếm theo title

    const query = Course.query().preload('teacher').orderBy('created_at', 'desc')

    // Filter theo status nếu có
    if (status) {
      query.where('status', status)
    }

    // Tìm kiếm theo title nếu có
    if (search) {
      query.whereILike('title', `%${search}%`)
    }

    const courses = await query.paginate(page, limit)

    return serialize({
      data: courses.all().map((course) => new CourseTransformer(course).toObject()),
      meta: {
        total: courses.total,
        page: courses.currentPage,
        limit: courses.perPage,
        lastPage: courses.lastPage,
      },
    })
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
    return serialize({ course: new CourseTransformer(course).toObject() })
  }

  /**
   * Tạo course mới — chỉ instructor
   */
  async store({ request, auth, bouncer, serialize }: HttpContext) {
    await bouncer.with(CoursePolicy).authorize('create')

    // Validate input trước khi xử lý
    const data = await request.validateUsing(createCourseValidator)
    const user = auth.getUserOrFail()

    const course = await Course.create({
      ...data,
      price: String(data.price),
      teacherId: user.id,
    })

    // Preload teacher để transformer có data
    await course.load('teacher')

    return serialize({ course: new CourseTransformer(course).toObject() })
  }

  /**
   * Cập nhật course — chỉ instructor sở hữu course
   */
  async update({ params, request, bouncer, serialize }: HttpContext) {
    const course = await Course.findOrFail(params.id)
    await bouncer.with(CoursePolicy).authorize('edit', course)

    // Validate input trước khi xử lý
    const data = await request.validateUsing(updateCourseValidator)
    await course.merge({
      ...data,
      price: data.price !== undefined ? String(data.price) : course.price,
    })
    await course.save()

    await course.load('teacher')

    return serialize({ course: new CourseTransformer(course).toObject() })
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
