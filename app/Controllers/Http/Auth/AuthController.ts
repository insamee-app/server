import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import School from 'App/Models/School'
import InternalServerErrorException from 'App/Exceptions/InternalServerErrorException'
import VerifyEmail from 'App/Mailers/VerifyEmail'
import SendVerifyEmailValidator from 'App/Validators/SendVerifyEmailValidator'
import SendResetPasswordValidator from 'App/Validators/SendResetPasswordValidator'
import ResetPassword from 'App/Mailers/ResetPassword'
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator'
import RegisterValidator from 'App/Validators/RegisterValidator'
import LoginValidator from 'App/Validators/LoginValidator'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import InsameeProfile from 'App/Models/InsameeProfile'
import TutoratProfile from 'App/Models/TutoratProfile'

export default class AuthController {
  public async register({ request }: HttpContextContract) {
    /**
     * Validate user details
     */
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

    try {
      await user.save()
    } catch (error) {
      throw new BadRequestException(`L'utilisateur existe déjà`)
    }

    await user.related('profile').create({ schoolId: school.id, userId: user.id })
    await InsameeProfile.create({ userId: user.id })
    await TutoratProfile.create({ userId: user.id })

    await new VerifyEmail(user.email).sendLater()

    return {
      register: 'ok',
    }
  }

  public async login({ auth, request, response }: HttpContextContract) {
    /*
     * Get email and password
     */
    const { email, password, rememberMe } = await request.validate(LoginValidator)

    /*
     * Try to login the user
     */
    await auth.attempt(email, password, rememberMe ?? false)

    return {
      login: 'ok',
    }
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.logout()

    return {
      logout: 'ok',
    }
  }

  public async verifyEmail({ request, params, auth }: HttpContextContract) {
    if (request.hasValidSignature()) {
      const { email } = params
      const user = (await User.findBy('email', email)) as User

      /**
       * Do if the user is not already verify
       */
      if (!user.isVerified) {
        user.isVerified = true
        await user.save()

        await auth.loginViaId(user.id)

        return {
          verifyEmail: 'ok',
        }
      }

      throw new ForbiddenException("L'utilisateur est déjà vérifié")
    }

    throw new BadRequestException("L'url n'a pas pu être validée")
  }

  public async resetPassword({ request, params }: HttpContextContract) {
    if (request.hasValidSignature()) {
      const { password } = await request.validate(ResetPasswordValidator)

      const { email } = params
      const user = (await User.findBy('email', email)) as User

      user.password = password
      await user.save()

      return {
        resetPassword: 'ok',
      }
    }

    throw new BadRequestException("L'url n'a pas pu être validée")
  }

  public async sendResetPassword({ request }: HttpContextContract) {
    const { email } = await request.validate(SendResetPasswordValidator)

    await new ResetPassword(email).sendLater()

    return {
      sendResetPassword: 'ok',
    }
  }

  public async sendVerifyEmail({ request }: HttpContextContract) {
    const { email } = await request.validate(SendVerifyEmailValidator)
    // TODO: il faut mettre en place le silent auth et on ne fait rien si le user est check et envoyer une error si c'est le cas (un forbidden)
    await new VerifyEmail(email).sendLater()

    return {
      sendVerifyEmail: 'ok',
    }
  }
}
