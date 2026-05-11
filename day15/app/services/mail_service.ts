import mail from '@adonisjs/mail/services/main'

export default class MailService {
  /**
   * Gửi email chào mừng khi student enroll khóa học
   */
  async sendEnrollmentEmail(data: {
    studentEmail: string
    studentName: string | null
    courseName: string
  }) {
    await mail.send((message) => {
      message.to(data.studentEmail).subject(`Chào mừng bạn đến với khóa học: ${data.courseName}`)
        .html(`
          <h2>Xin chào ${data.studentName ?? 'bạn'}!</h2>
          <p>Bạn đã đăng ký thành công khóa học <strong>${data.courseName}</strong>.</p>
          <p>Chúc bạn học tốt!</p>
          <br/>
          <p>Trân trọng,</p>
          <p>LMS System</p>
        `)
    })
  }

  /**
   * Gửi email thông báo khi student được chấm điểm
   */
  async sendGradeEmail(data: {
    studentEmail: string
    studentName: string | null
    assignmentTitle: string
    score: number
    maxScore: number
    feedback: string | null
  }) {
    await mail.send((message) => {
      message.to(data.studentEmail).subject(`Kết quả bài tập: ${data.assignmentTitle}`).html(`
          <h2>Xin chào ${data.studentName ?? 'bạn'}!</h2>
          <p>Bài tập <strong>${data.assignmentTitle}</strong> của bạn đã được chấm.</p>
          <p>Điểm số: <strong>${data.score}/${data.maxScore}</strong></p>
          ${data.feedback ? `<p>Nhận xét: ${data.feedback}</p>` : ''}
          <br/>
          <p>Trân trọng,</p>
          <p>LMS System</p>
        `)
    })
  }
}
