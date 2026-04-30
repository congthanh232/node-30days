import { inject } from '@adonisjs/core'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import AuthService from '#services/auth_service'

@inject()
export default class AccessTokensController {
  constructor(private authService: AuthService) {}

  async store({ request, serialize }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const { user, token } = await this.authService.login(email, password)

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }

  async destroy({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    await this.authService.logout(user)

    return { message: 'Logged out successfully' }
  }
}
