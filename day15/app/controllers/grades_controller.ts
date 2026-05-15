import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import Grade from '#models/grade'
import Submission from '#models/submission'
import User from '#models/user'
import MailService from '#services/mail_service'
import { createGradeValidator } from '#validators/grade'
import CoursePolicy from '#policies/course_policy'

@inject()
export default class GradesController {
  constructor(private mailService: MailService) {}

  /**
   * Chấm điểm — chỉ instructor sở hữu course
   */
  async store({ request, auth, bouncer, serialize }: HttpContext) {
    const data = await request.validateUsing(createGradeValidator)

    // Lấy submission kèm assignment và course
    const submission = await Submission.query()
      .where('id', data.submissionId)
      .preload('assignment', (q) => q.preload('course'))
      .firstOrFail()

    // Kiểm tra instructor có sở hữu course không
    await bouncer.with(CoursePolicy).authorize('edit', submission.assignment.course)

    // Kiểm tra đã chấm chưa
    const existing = await Grade.query().where('submission_id', data.submissionId).first()
    if (existing) {
      return serialize({ message: 'This submission has already been graded' })
    }

    // Tạo grade
    const grade = await Grade.create({
      submissionId: data.submissionId,
      gradedBy: auth.getUserOrFail().id,
      score: String(data.score),
      feedback: data.feedback,
    })

    // Update submission status → graded
    await submission.merge({ status: 'graded' }).save()

    // Lấy thông tin student để gửi email
    const student = await User.findOrFail(submission.userId)

    // Gửi email thông báo điểm
    this.mailService
      .sendGradeEmail({
        studentEmail: student.email,
        studentName: student.fullName,
        assignmentTitle: submission.assignment.title,
        score: data.score,
        maxScore: submission.assignment.maxScore,
        feedback: data.feedback ?? null,
      })
      .catch((err) => {
        console.error('Failed to send grade email:', err)
      })

    return serialize({ grade })
  }

  /**
   * Lấy danh sách grades của instructor — xem các bài đã chấm
   */
  async index({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    const grades = await Grade.query()
      .where('graded_by', user.id)
      .preload('submission', (q) => {
        q.preload('assignment')
      })
      .orderBy('created_at', 'desc')

    return serialize({ grades })
  }

  /**
   * Lấy chi tiết 1 grade
   */
  async show({ params, serialize }: HttpContext) {
    const grade = await Grade.query()
      .where('id', params.id)
      .preload('submission', (q) => {
        q.preload('assignment')
      })
      .firstOrFail()

    return serialize({ grade })
  }
}
