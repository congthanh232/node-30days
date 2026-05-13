import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Role from '#models/role'

export default class UserSeeder extends BaseSeeder {
  async run() {
    // Lấy roles
    const instructorRole = await Role.findByOrFail('name', 'instructor')
    const studentRole = await Role.findByOrFail('name', 'student')

    // Tạo 5 instructors
    for (let i = 1; i <= 5; i++) {
      const instructor = await User.firstOrCreate(
        { email: `instructor${i}@lms.com` },
        {
          fullName: `Instructor ${i}`,
          email: `instructor${i}@lms.com`,
          password: 'password123',
        }
      )
      // Gán role instructor nếu chưa có
      const hasRole = await instructor.related('roles').query().where('name', 'instructor').first()
      if (!hasRole) {
        await instructor.related('roles').attach([instructorRole.id])
      }
    }

    console.log(' 5 Instructors seeded!')

    // Tạo 100 students
    for (let i = 1; i <= 100; i++) {
      const student = await User.firstOrCreate(
        { email: `student${i}@lms.com` },
        {
          fullName: `Student ${i}`,
          email: `student${i}@lms.com`,
          password: 'password123',
        }
      )
      // Gán role student nếu chưa có
      const hasRole = await student.related('roles').query().where('name', 'student').first()
      if (!hasRole) {
        await student.related('roles').attach([studentRole.id])
      }
    }

    console.log(' 100 Students seeded!')
  }
}
