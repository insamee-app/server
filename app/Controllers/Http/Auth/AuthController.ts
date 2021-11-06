import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { string } from '@ioc:Adonis/Core/Helpers'
import BadRequestException from 'App/Exceptions/BadRequestException'
import NotFoundException from 'App/Exceptions/NotFoundException'
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
import Profile from 'App/Models/Profile'
import { getSchoolByEmail } from 'App/Services/AuthService'

export default class AuthController {
  public async register({ request }: HttpContextContract) {
    /**
     * Validate user details
     */
    const userDetails = await request.validate(RegisterValidator)

    /*
     * Get the corresponding school
     */
    const school = await getSchoolByEmail(userDetails.email)
    if (!school)
      throw new BadRequestException(
        `Impossible de trouver l'école correspondante à votre adresse électronique`
      )

    /**
     * Create a new user
     */
    const user = new User()
    user.email = userDetails.email
    user.password = userDetails.password
    // Setup email for user to extend the experience
    user.emailInterestedTutorat = userDetails.receiveEmail

    try {
      await user.save()
    } catch (error) {
      throw new BadRequestException(`L'utilisateur existe déjà`)
    }

    const profile: Partial<Profile> = {
      schoolId: school.id,
      userId: user.id,
    }

    // Fill profile using the data in the email
    const extractName = new RegExp(/^(?<firstName>.*)\.(?<lastName>.*)@/, 'i')
    if (extractName.test(userDetails.email)) {
      const { firstName, lastName } = extractName.exec(userDetails.email)?.groups!
      profile.firstName = string.titleCase(firstName.split('_').join(' ')) // remove all _ and capitalize
      profile.lastName = lastName.split('_').join(' ').toUpperCase() // remove all _ and uppercase
    }

    await user.related('profile').create(profile)
    await InsameeProfile.create({ userId: user.id })
    await TutoratProfile.create({ userId: user.id })

    await new VerifyEmail(user.email).sendLater()

    return {
      register: 'ok',
    }
  }

  public async login({ auth, request }: HttpContextContract) {
    /*
     * Get email and password
     */
    const { email, password, rememberMe } = await request.validate(LoginValidator)

    const school = await getSchoolByEmail(email)
    if (!school)
      throw new NotFoundException(
        `Impossible de trouver l'école correspondante à votre adresse électronique`
      )

    /*
     * Try to login the user
     */
    await auth.attempt(email, password, rememberMe ?? false)

    const { user } = auth

    if (user?.isBlocked) throw new ForbiddenException('Votre compte est bloqué')

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
    // Validator check if email is already verify
    const { email } = await request.validate(SendVerifyEmailValidator)
    await new VerifyEmail(email).sendLater()

    return {
      sendVerifyEmail: 'ok',
    }
  }
}
