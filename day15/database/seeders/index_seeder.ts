import { BaseSeeder } from '@adonisjs/lucid/seeders'
import RoleSeeder from './role_seeder.js'
import UserSeeder from './user_seeder.js'
import CourseSeeder from './course_seeder.js'
import EnrollmentSeeder from './enrollment_seeder.js'

export default class IndexSeeder extends BaseSeeder {
  async run() {
    console.log('🌱 Starting seed...')

    // Thứ tự quan trọng! Role trước → User → Course → Enrollment
    await new RoleSeeder(this.client).run()
    await new UserSeeder(this.client).run()
    await new CourseSeeder(this.client).run()
    await new EnrollmentSeeder(this.client).run()

    console.log('🎉 All seeders completed!')
  }
}
