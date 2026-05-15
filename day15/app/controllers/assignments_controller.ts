import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'
import Assignment from '#models/assignment'
import CoursePolicy from '#policies/course_policy'
import { createAssignmentValidator, updateAssignmentValidator } from '#validators/assignment'

@inject()
export default class AssignmentsController {
  /**
   * Lấy danh sách assignments của course — public
   */
  async index({ params, serialize }: HttpContext) {
    const course = await Course.findOrFail(params.course_id)

    const assignments = await Assignment.query()
      .where('course_id', course.id)
      .orderBy('created_at', 'asc')

    return serialize({ assignments })
  }

  /**
   * Lấy chi tiết 1 assignment — public
   */
  async show({ params, serialize }: HttpContext) {
    const assignment = await Assignment.query()
      .where('id', params.id)
      .where('course_id', params.course_id)
      .firstOrFail()

    return serialize({ assignment })
  }

  /**
   * Tạo assignment mới — chỉ instructor sở hữu course
   */
  async store({ params, request, bouncer, serialize }: HttpContext) {
    const course = await Course.findOrFail(params.course_id)
    await bouncer.with(CoursePolicy).authorize('edit', course)

    const data = await request.validateUsing(createAssignmentValidator)

    const assignment = await Assignment.create({
      ...data,
      courseId: course.id,
    })

    return serialize({ assignment })
  }

  /**
   * Cập nhật assignment — chỉ instructor sở hữu course
   */
  async update({ params, request, bouncer, serialize }: HttpContext) {
    const course = await Course.findOrFail(params.course_id)
    await bouncer.with(CoursePolicy).authorize('edit', course)

    const assignment = await Assignment.query()
      .where('id', params.id)
      .where('course_id', params.course_id)
      .firstOrFail()

    const data = await request.validateUsing(updateAssignmentValidator)
    await assignment.merge(data).save()

    return serialize({ assignment })
  }

  /**
   * Xóa assignment — chỉ instructor sở hữu course
   */
  async destroy({ params, bouncer }: HttpContext) {
    const course = await Course.findOrFail(params.course_id)
    await bouncer.with(CoursePolicy).authorize('edit', course)

    const assignment = await Assignment.query()
      .where('id', params.id)
      .where('course_id', params.course_id)
      .firstOrFail()

    await assignment.delete()
    return { message: 'Assignment deleted successfully' }
  }
}
