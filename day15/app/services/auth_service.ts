import User from '#models/user'

export default class AuthService {
  async register(data: {
    fullName: string | null
    email: string
    password: string
    passwordConfirmation: string
  }) {
    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    })
    const token = await User.accessTokens.create(user)

    return { user, token }
  }

  async login(email: string, password: string) {
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return { user, token }
  }

  async logout(user: User) {
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }
  }
}
