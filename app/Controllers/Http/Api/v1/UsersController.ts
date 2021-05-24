import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { filterUsers, getUser, preloadUser } from 'App/Services/UserService'
import QueryUsersValidator from 'App/Validators/QueryUsersValidator'
import UserValidator from 'App/Validators/UserValidator'
import Application from '@ioc:Adonis/Core/Application'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import { schema } from '@ioc:Adonis/Core/Validator'

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

  public async update({ request, response, params }: HttpContextContract) {
    const id = params.id as number
    const user = await getUser(id)

    const { associations, skills, focusInterests, ...data } = await request.validate(UserValidator)

    const avatarSchema = schema.create({
      avatar: schema.file.optional({
        size: '150kb',
        extnames: ['jpg', 'png', 'jpeg'],
      }),
    })

    let avatar
    try {
      const data = await request.validate({ schema: avatarSchema })
      avatar = data.avatar
    } catch (error) {
      response.badRequest(error)
    }

    if (avatar) {
      let filename = user.avatarId
      console.log(filename)
      if (!user.avatarId) {
        filename = `${cuid()}.${avatar.extname}`
        user.avatarId = filename
      }
      if (process.env.NODE_ENV === 'production') {
        // TODO: send to s3
      } else {
        avatar.move(Application.makePath('../storage/uploads'), { name: filename, overwrite: true })
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
