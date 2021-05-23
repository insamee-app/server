import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { filterUsers, getUser, preloadUser } from 'App/Services/UserService'
import QueryUsersValidator from 'App/Validators/QueryUsersValidator'
import UserValidator from 'App/Validators/UserValidator'
import Application from '@ioc:Adonis/Core/Application'
import { v4 as uuid } from 'uuid'

export default class UsersController {
  public async me({ auth }: HttpContextContract) {
    const { user } = auth
    await preloadUser(user!)
    return user
  }

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

    const { associations, skills, focusInterests, avatar, ...data } = await request.validate(
      UserValidator
    )

    if (avatar) {
      avatar.clientName = uuid() + '.' + avatar.extname
      user.avatarId = avatar.clientName
      // TODO: voir si on remove les files lors d'un changement de fichiers
      if (process.env.NODE_ENV === 'production') {
        // TODO: send to s3
      } else {
        avatar.move(Application.makePath('../storage/uploads'))
      }
    }

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
    user.related('skills').detach()
    user.related('focusInterests').detach()
    await user.delete()

    return user
  }
}
