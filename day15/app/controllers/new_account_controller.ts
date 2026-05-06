import { inject } from '@adonisjs/core'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import AuthService from '#services/auth_service'

@inject()
export default class NewAccountController {
  constructor(private authService: AuthService) {}

  /**
   * Đăng ký tài khoản mới, mặc định role là student
   * Muốn tạo instructor thì truyền thêm role: 'instructor'
   */
  async store({ request, serialize }: HttpContext) {
    const data = await request.validateUsing(signupValidator)
    const role = request.input('role', 'student') // lấy role từ request, default student

    const { user, token } = await this.authService.register(data, role)

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }
}
