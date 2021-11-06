import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { getUser } from 'App/Services/UserService'
import { getProfile, getInsameeProfile, getTutoratProfile } from 'App/Services/ProfileService'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import Tutorat from 'App/Models/Tutorat'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'
import PaginateQueryValidator from 'App/Validators/PaginateQueryValidator'
import PlatformQueryValidator, { Platform } from 'App/Validators/PlatformQueryValidator'

export default class UsersController {
  private LIMITE = 20

  public async index({ request, bouncer }: HttpContextContract) {
    try {
      await bouncer.with('UserPolicy').authorize('view')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { page } = await request.validate(PaginateQueryValidator)

    const users = await User.query().withTrashed().orderBy('id', 'asc').paginate(page, this.LIMITE)

    return users
  }

  public async show({ auth, params, bouncer }: HttpContextContract) {
    try {
      await bouncer.with('UserPolicy').authorize('view')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { user: authenticatedUser } = auth
    const { id } = params

    const user = await getUser(id, authenticatedUser!.isAdmin)

    return user
  }

  public async update({ auth, params, request, bouncer }: HttpContextContract) {
    const { user: authenticatedUser } = auth

    const { id } = params
    const user = await getUser(id, authenticatedUser?.isAdmin)

    try {
      await bouncer.with('UserPolicy').authorize('update', user)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { platform } = await request.validate(PlatformQueryValidator)
    const { isVerified, isBlocked, isAdmin, isModerator, isEventCreator, emailInterestedTutorat } =
      await request.validate(UserValidator)

    if (await bouncer.with('UserPolicy').allows('updateAdmin')) {
      user.merge({ isVerified, isBlocked, isAdmin, isModerator, isEventCreator })
    }

    user.merge({ emailInterestedTutorat })

    await user.save()

    if (platform === Platform.ADMIN && (await bouncer.with('UserPolicy').allows('updateAdmin'))) {
      return user
    }

    return user.serialize({
      fields: ['email', 'email_interested_tutorat'],
    })
  }

  public async destroy({ auth, params, bouncer }: HttpContextContract) {
    const { user: authenticatedUser } = auth
    const { id } = params

    const user = await getUser(id, authenticatedUser!.isAdmin)

    try {
      await bouncer.with('UserPolicy').authorize('destroy', user)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const profile = await getProfile(id, authenticatedUser!.isAdmin)
    const insameeProfile = await getInsameeProfile(id, authenticatedUser!.isAdmin)
    const tutoratProfile = await getTutoratProfile(id, authenticatedUser!.isAdmin)
    // const associationsReports = await AssociationsReport.query().where('user_id', id).exec()
    // const tutoratsReports = await TutoratsReport.query().where('user_id', id).exec()
    const tutorats = await Tutorat.query().where('user_id', id).exec()

    for (const tutorat of tutorats) {
      await tutorat.delete()
    }
    // for (const report of associationsReports) {
    //   await report.delete()
    // }
    // for (const report of tutoratsReports) {
    //   await report.delete()
    // }
    await insameeProfile.delete()
    await tutoratProfile.delete()
    await profile.delete()
    await user.delete()

    return {
      destroy: 'ok',
    }
  }
}
