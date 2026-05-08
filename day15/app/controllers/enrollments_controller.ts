import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Enrollment from '#models/enrollment'
import Course from '#models/course'
import { createEnrollmentValidator } from '#validators/enrollment'

@inject()
export default class EnrollmentsController {
  /**
   * Đăng ký khóa học — dùng transaction để đảm bảo toàn vẹn dữ liệu
   */
  async store({ request, auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const { courseId } = await request.validateUsing(createEnrollmentValidator)

    // Kiểm tra course có tồn tại không
    const course = await Course.findOrFail(courseId)

    // Kiểm tra đã enrolled chưa
    const existing = await Enrollment.query()
      .where('user_id', user.id)
      .where('course_id', courseId)
      .first()

    if (existing) {
      return serialize({ message: 'Already enrolled in this course' })
    }

    // Dùng transaction — nếu bất kỳ bước nào lỗi → rollback hết
    const enrollment = await db.transaction(async (trx) => {
      const newEnrollment = await Enrollment.create(
        {
          userId: user.id,
          courseId: course.id,
          status: 'active',
          paidPrice: course.price,
        },
        { client: trx } // truyền transaction client vào
      )

      // (Tương lai) xử lý payment ở đây, cùng transaction
      // await PaymentService.charge(user, course.price, { client: trx })

      return newEnrollment
    })

    return serialize({ enrollment })
  }

  /**
   * Lấy danh sách khóa học đã enrolled của user
   */
  async index({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    const enrollments = await Enrollment.query()
      .where('user_id', user.id)
      .preload('course', (query) => {
        query.preload('teacher') // preload teacher của course luôn, tránh N+1
      })
      .orderBy('created_at', 'desc')

    return serialize({ enrollments })
  }
}
