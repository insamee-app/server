import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import School from 'App/Models/School'
import InternalServerErrorException from 'App/Exceptions/InternalServerErrorException'
import { preloadUser } from 'App/Services/UserService'
import VerifyEmail from 'App/Mailers/VerifyEmail'
import SendVerifyEmailValidator from 'App/Validators/SendVerifyEmailValidator'
import SendResetPasswordValidator from 'App/Validators/SendResetPasswordValidator'
import ResetPassword from 'App/Mailers/ResetPassword'
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator'
import RegisterValidator from 'App/Validators/RegisterValidator'
import LoginValidator from 'App/Validators/LoginValidator'

export default class AuthController {
  public async register({ request }: HttpContextContract) {
    /**
     * Validate user details
     */
    // TODO: mettre en place une regex pour les mots de passe (attention, pas pour le login, uniquement le register
    const userDetails = await request.validate(RegisterValidator)

    /*
     * Get the corresponding school
     */
    const hostRegExp = new RegExp(/@(?<host>.*)$/, 'i')
    const host = hostRegExp.exec(userDetails.email)!.groups!.host

    const school = await School.findBy('host', host)
    if (!school)
      throw new InternalServerErrorException(
        `Impossible de trouver l'école correspondante à ${host}`
      )

    /**
     * Create a new user
     */
    const user = new User()
    user.email = userDetails.email
    user.password = userDetails.password
    user.schoolId = school.id

    try {
      await user.save()
    } catch (error) {
      throw new BadRequestException(`L'utilisateur ${user.email} existe déjà`)
    }

    await new VerifyEmail(user.email).sendLater()

    await user.preload('school')

    return user
  }

  public async login({ auth, request }: HttpContextContract) {
    /*
     * Get email and password
     */
    const { email, password, rememberMe } = await request.validate(LoginValidator)

    /*
     * Try to login the user
     */
    const user = await auth.attempt(email, password, rememberMe ?? false)

    await preloadUser(user)

    return user
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.logout()

    return {
      logout: true,
    }
  }

  public async verifyEmail({ request, params }: HttpContextContract) {
    if (request.hasValidSignature()) {
      const { email } = params
      const user = (await User.findBy('email', email)) as User

      if (!user.isVerified) {
        user.isVerified = true
        await user.save()
      }

      await preloadUser(user)
      return user
    }

    throw new BadRequestException("L'url n'a pas pu être validée")
  }

  public async resetPassword({ request, params }: HttpContextContract) {
    if (request.hasValidSignature()) {
      // TODO: mettre en place une regex pour les mots de passe (attention, pas pour le login, uniquement le register
      const { password } = await request.validate(ResetPasswordValidator)

      const { email } = params
      const user = (await User.findBy('email', email)) as User

      user.password = password
      await user.save()

      await preloadUser(user)
      return user
    }

    throw new BadRequestException("L'url n'a pas pu être validée")
  }

  public async sendResetPassword({ request }: HttpContextContract) {
    const { email } = await request.validate(SendResetPasswordValidator)

    await new ResetPassword(email).sendLater()

    return {
      sended: true,
    }
  }

  public async sendVerifyEmail({ request }: HttpContextContract) {
    const { email } = await request.validate(SendVerifyEmailValidator)

    await new VerifyEmail(email).sendLater()

    return {
      sended: true,
    }
  }
}
