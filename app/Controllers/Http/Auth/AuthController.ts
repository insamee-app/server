import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserValidator from 'App/Validators/UserValidator'
import BadRequestException from 'App/Exceptions/BadRequestException'

export default class AuthController {
  public async register({ request, auth }: HttpContextContract) {
    /**
     * Validate user details
     */
    const userDetails = await request.validate(UserValidator)

    /**
     * Create a new user
     */
    const user = new User()
    user.email = userDetails.email
    user.password = userDetails.password
    try {
      await user.save()
    } catch (error) {
      throw new BadRequestException('Cet utilisateur existe déjà')
    }

    /**
     * Login the user
     */
    await auth.login(user)

    return user
  }

  public async login({ auth, request }: HttpContextContract) {
    /*
     * Get email and password
     */
    const email = request.input('email')
    const password = request.input('password')

    /*
     * Try to login the user
     */
    const user = await auth.attempt(email, password)

    return user
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.logout()

    return
  }
}
