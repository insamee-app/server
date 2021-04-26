import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import School from 'App/Models/School'

import User from 'App/Models/User'
import { getUser } from 'App/Services/UserService'
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {
  public async index() {
    const users = await User.query().preload('school')
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

    /*
     * Update user
     */
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key]
        user[key] = element
      }
    }

    const updatedUser = await user.save()
    return updatedUser
  }

  public async destroy({ params }: HttpContextContract) {
    const id = params.id as number

    const user = await getUser(id)
    await user.delete()

    return user
  }
}
