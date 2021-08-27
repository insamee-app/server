import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { getUser } from 'App/Services/UserService'
import { getProfile, getInsameeProfile, getTutoratProfile } from 'App/Services/ProfileService'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import Tutorat from 'App/Models/Tutorat'
import User from 'App/Models/User'
import UserQueryValidator from 'App/Validators/UserQueryValidator'
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {
  public async index({ request, bouncer }: HttpContextContract) {
    try {
      await bouncer.with('UserPolicy').authorize('view')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { page } = await request.validate(UserQueryValidator)

    const users = await User.query()
      .withTrashed()
      .orderBy('id', 'asc')
      .paginate(page ?? 1, 20)

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
    try {
      await bouncer.with('UserPolicy').authorize('update')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { user: authenticatedUser } = auth
    const { id } = params

    const user = await getUser(id, authenticatedUser?.isAdmin)

    const { isVerified, isBlocked, isAdmin } = await request.validate(UserValidator)

    user.merge({ isVerified, isBlocked, isAdmin })
    await user.save()

    return user
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
