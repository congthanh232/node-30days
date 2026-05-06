import type User from '#models/user'
import Role from '#models/role'

export default class RoleService {
  /**
   * Gán role cho user theo tên role
   */
  async assignRole(user: User, roleName: string): Promise<void> {
    const role = await Role.findByOrFail('name', roleName)
    await user.related('roles').attach([role.id])
  }

  /**
   * Lấy danh sách tên roles của user
   */
  async getRoles(user: User): Promise<string[]> {
    await user.load('roles')
    return user.roles.map((role) => role.name)
  }

  /**
   * Kiểm tra user có role cụ thể không
   */
  async hasRole(user: User, roleName: string): Promise<boolean> {
    const roles = await this.getRoles(user)
    return roles.includes(roleName)
  }

  /**
   * Seed 3 roles mặc định nếu chưa có
   */
  async seedRoles(): Promise<void> {
    const defaultRoles = [
      { name: 'admin', description: 'Quản trị viên hệ thống' },
      { name: 'instructor', description: 'Giảng viên tạo và quản lý khóa học' },
      { name: 'student', description: 'Học viên đăng ký và học khóa học' },
    ]

    for (const role of defaultRoles) {
      await Role.firstOrCreate({ name: role.name }, role)
    }
  }
}
