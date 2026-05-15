import Assignment from '#models/assignment'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Submission from '#models/submission'
import Enrollment from '#models/enrollment'
import SubmissionPolicy from '#policies/submission_policy'

@inject()
export default class SubmissionsController {
  /**
   * Nộp bài — chỉ student, dùng transaction
   */
  async store({ request, auth, bouncer, serialize }: HttpContext) {
    await bouncer.with(SubmissionPolicy).authorize('create')

    const user = auth.getUserOrFail()
    const data = request.only(['assignment_id', 'content', 'file_url'])

    const submission = await db.transaction(async (trx) => {
      // Lấy assignment để biết thuộc course nào
      const assignment = await Assignment.findOrFail(data.assignment_id, { client: trx })

      // Kiểm tra student đã enrolled course chứa assignment này chưa
      const enrollment = await Enrollment.query({ client: trx })
        .where('user_id', user.id)
        .where('course_id', assignment.courseId) // 👈 đơn giản hơn
        .where('status', 'active')
        .first()

      if (!enrollment) {
        throw new Error('You must enroll in this course before submitting')
      }

      // Tạo submission trong cùng transaction
      const newSubmission = await Submission.create(
        {
          userId: user.id,
          assignmentId: data.assignment_id,
          content: data.content,
          fileUrl: data.file_url,
          status: 'draft',
        },
        { client: trx }
      )

      return newSubmission
    })

    return serialize({ submission })
  }

  /**
   * Cập nhật bài nộp — chỉ student sở hữu và còn draft
   */
  async update({ params, request, bouncer, serialize }: HttpContext) {
    const submission = await Submission.findOrFail(params.id)
    await bouncer.with(SubmissionPolicy).authorize('edit', submission)

    const data = request.only(['content', 'file_url', 'status'])

    await db.transaction(async (trx) => {
      await submission.useTransaction(trx).merge(data).save()

      // Nếu status chuyển sang submitted thì lưu thời gian nộp
      if (data.status === 'submitted') {
        submission.submittedAt = new Date() as any
        await submission.useTransaction(trx).save()
      }
    })

    return serialize({ submission })
  }

  /**
   * Lấy danh sách submissions của student — chỉ xem của mình
   */
  async index({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    const submissions = await Submission.query()
      .where('user_id', user.id)
      .preload('assignment')
      .orderBy('created_at', 'desc')

    return serialize({ submissions })
  }

  /**
   * Lấy chi tiết 1 submission
   */
  async show({ params, auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    const submission = await Submission.query()
      .where('id', params.id)
      .where('user_id', user.id) // chỉ xem của chính mình
      .preload('assignment')
      .preload('grade')
      .firstOrFail()

    return serialize({ submission })
  }
}
