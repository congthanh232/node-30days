import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Course from '#models/course'
import Enrollment from '#models/enrollment'

export default class EnrollmentSeeder extends BaseSeeder {
  async run() {
    // Lấy danh sách students
    const students = await User.query().whereHas('roles', (q) => {
      q.where('name', 'student')
    })

    // Lấy danh sách published courses
    const courses = await Course.query().where('status', 'published')

    let count = 0

    // Mỗi student enroll 3-5 courses ngẫu nhiên
    for (const student of students) {
      // Lấy ngẫu nhiên 3-5 courses
      const numberOfCourses = Math.floor(Math.random() * 3) + 3
      const shuffled = courses.sort(() => Math.random() - 0.5)
      const selectedCourses = shuffled.slice(0, numberOfCourses)

      for (const course of selectedCourses) {
        // firstOrCreate → không duplicate nếu chạy lại
        const existing = await Enrollment.query()
          .where('user_id', student.id)
          .where('course_id', course.id)
          .first()

        if (!existing) {
          await Enrollment.create({
            userId: student.id,
            courseId: course.id,
            status: 'active',
            paidPrice: course.price,
          })
          count++
        }
      }
    }

    console.log(`✅ ${count} Enrollments seeded!`)
  }
}
