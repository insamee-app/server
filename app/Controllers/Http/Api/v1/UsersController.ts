import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { filterUsers, getUser, preloadUser } from 'App/Services/UserService'
import QueryUsersValidator from 'App/Validators/QueryUsersValidator'
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {
  public async index({ request }: HttpContextContract) {
    const users = await filterUsers(request, QueryUsersValidator)
    return users
  }

  public async show({ params }: HttpContextContract) {
    const id = params.id as number

    const user = await getUser(id)

    await preloadUser(user)

    return user
  }

  public async update({ request, params }: HttpContextContract) {
    const id = params.id as number
    const user = await getUser(id)

    const { associations, skills, focusInterests, ...data } = await request.validate(UserValidator)

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
    if (skills) await user.related('skills').sync(skills)
    if (focusInterests) await user.related('focusInterests').sync(focusInterests)

    const updatedUser = await user.save()

    await preloadUser(user)

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
