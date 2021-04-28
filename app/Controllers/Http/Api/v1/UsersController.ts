import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { getUser } from 'App/Services/UserService'
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {
  public async index() {
    const users = await User.query().preload('school').preload('associations').preload('skills')
    return users
  }

  public async show({ params }: HttpContextContract) {
    const id = params.id as number

    const user = await getUser(id)
    await user.preload('school')
    await user.preload('associations')
    await user.preload('skills')
    return user
  }

  public async update({ request, params }: HttpContextContract) {
    const id = params.id as number
    const user = await getUser(id)

    const { associations, ...data } = await request.validate(UserValidator)

    /*
     * Update user
     */
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key]
        user[key] = element
      }
    }

    if (associations) await user.related('associations').sync(associations)
    const updatedUser = await user.save()
    return updatedUser
  }

  public async destroy({ params }: HttpContextContract) {
    const id = params.id as number

    const user = await getUser(id)

    user.related('associations').detach()
    await user.delete()

    return user
  }
}
