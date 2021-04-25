import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {
  public async store({ request }: HttpContextContract) {
    const user = await request.validate(UserValidator)

    console.info(user)

    return user
  }
}
