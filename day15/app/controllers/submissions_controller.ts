import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import Submission from '#models/submission'
import SubmissionPolicy from '#policies/submission_policy'

@inject()
export default class SubmissionsController {
  /**
   * Nộp bài — chỉ student
   */
  async store({ request, auth, bouncer, serialize }: HttpContext) {
    await bouncer.with(SubmissionPolicy).authorize('create')

    const user = auth.getUserOrFail()
    const data = request.only(['assignment_id', 'content', 'file_url'])

    const submission = await Submission.create({
      userId: user.id,
      assignmentId: data.assignment_id,
      content: data.content,
      fileUrl: data.file_url,
      status: 'draft',
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
    await submission.merge(data).save()

    // Nếu status chuyển sang submitted thì lưu thời gian nộp
    if (data.status === 'submitted') {
      submission.submittedAt = new Date() as any
      await submission.save()
    }

    return serialize({ submission })
  }
}
