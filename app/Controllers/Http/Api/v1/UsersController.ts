import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { getUser } from 'App/Services/UserService'
import { getProfile, getInsameeProfile } from 'App/Services/ProfileService'
import ForbiddenException from 'App/Exceptions/ForbiddenException'

export default class UsersController {
  public async destroy({ params, bouncer }: HttpContextContract) {
    const id = params.id as number

    const user = await getUser(id)

    try {
      await bouncer.with('UserPolicy').authorize('update', user)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const profile = await getProfile(id)
    const insameeProfile = await getInsameeProfile(id)

    insameeProfile.related('associations').detach()
    insameeProfile.related('skills').detach()
    insameeProfile.related('focusInterests').detach()

    await insameeProfile.delete()
    await profile.delete()
    await user.delete()

    return {
      destroy: 'ok',
    }
  }
}
