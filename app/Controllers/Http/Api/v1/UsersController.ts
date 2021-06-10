import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import { getUser } from 'App/Services/UserService'
import UserValidator from 'App/Validators/UserValidator'
import { getInsameeProfile } from 'App/Services/ProfileService'
import ForbiddenException from 'App/Exceptions/ForbiddenException'

export default class UsersController {
  public async update({ request, params, bouncer }: HttpContextContract) {
    const id = params.id as number
    const user = await getUser(id)

    try {
      await bouncer.with('UserPolicy').authorize('update', user)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { avatar } = await request.validate(UserValidator)

    if (avatar) {
      const filename = `${cuid()}.${avatar.extname}`
      user.avatarId = filename
      if (Application.inProduction) {
        // TODO: send to s3 and remove the previous file
      } else {
        // in dev, not need to remove a file
        avatar.move(Application.makePath('../storage/uploads'), { name: filename, overwrite: true })
      }
    }

    const updatedUser = await user.save()

    return updatedUser
  }

  public async destroy({ params, bouncer }: HttpContextContract) {
    const id = params.id as number

    const user = await getUser(id)

    try {
      await bouncer.with('UserPolicy').authorize('update', user)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const insameeProfile = await getInsameeProfile(id)

    insameeProfile.related('associations').detach()
    insameeProfile.related('skills').detach()
    insameeProfile.related('focusInterests').detach()

    await insameeProfile.delete()
    await user.delete()

    return {
      delete: 'ok',
    }
  }
}
