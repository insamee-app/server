import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthValidator from 'App/Validators/AuthValidator'
import BadRequestException from 'App/Exceptions/BadRequestException'
import School from 'App/Models/School'
import InternalServerError from 'App/Exceptions/InternalServerErrorException'

export default class AuthController {
  public async register({ request, auth }: HttpContextContract) {
    /**
     * Validate user details
     */
    const userDetails = await request.validate(AuthValidator)

    /*
     * Get the corresponding school
     */
    const hostRegExp = new RegExp(/@(?<host>.*)$/, 'i')
    const host = hostRegExp.exec(userDetails.email)!.groups!.host

    const school = await School.findBy('host', host)
    if (!school)
      throw new InternalServerError(`Impossible de trouver l'école correspondante à ${host}`)

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

    /**
     * Login the user
     */
    await auth.login(user)

    await user.preload('school')

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

    await user.preload('school')

    return user
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.logout()

    return
  }
}
