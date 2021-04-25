import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import { getUser } from 'App/Services/UserService'
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {
  public async index() {
    const users = await User.all()
    return users
  }

  public async show({ params }: HttpContextContract) {
    const id = params.id as number

    const user = await getUser(id)

    return user
  }

  public async update({ request, params }: HttpContextContract) {
    const id = params.id as number
    const user = await getUser(id)

    const data = await request.validate(UserValidator)

    // const updatedUser = await user.save()
    return data
  }

  public async destroy({ params }: HttpContextContract) {
    const id = params.id as number

    const user = await getUser(id)
    await user.delete()

    return user
  }
}
