import User from '#models/user'
import RoleService from '#services/role_service'
import { inject } from '@adonisjs/core'

@inject()
export default class AuthService {
  constructor(private roleService: RoleService) {}

  async register(
    data: {
      fullName: string | null
      email: string
      password: string
      passwordConfirmation: string
    },
    role: string = 'student' // mặc định register là student
  ) {
    // Seed roles nếu chưa có
    await this.roleService.seedRoles()

    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    })

    // Gán role cho user vừa tạo
    await this.roleService.assignRole(user, role)

    const token = await User.accessTokens.create(user)

    return { user, token }
  }

  async login(email: string, password: string) {
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    // Load roles để trả về trong response
    await user.load('roles')

    return { user, token }
  }

  async logout(user: User) {
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }
  }
}
