import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'

export default class RoleSeeder extends BaseSeeder {
  async run() {
    /**
     * Tạo 3 roles mặc định nếu chưa có
     * firstOrCreate → không tạo duplicate nếu chạy lại
     */
    await Role.firstOrCreate({ name: 'admin' }, { description: 'Quản trị viên hệ thống' })
    await Role.firstOrCreate(
      { name: 'instructor' },
      { description: 'Giảng viên tạo và quản lý khóa học' }
    )
    await Role.firstOrCreate(
      { name: 'student' },
      { description: 'Học viên đăng ký và học khóa học' }
    )

    console.log(' Roles seeded!')
  }
}
