import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { getUser } from 'App/Services/UserService'
import { getProfile, getInsameeProfile, getTutoratProfile } from 'App/Services/ProfileService'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import AssociationsReport from 'App/Models/AssociationsReport'
import TutoratsReport from 'App/Models/TutoratsReport'
import Tutorat from 'App/Models/Tutorat'

export default class UsersController {
  public async destroy({ params, bouncer }: HttpContextContract) {
    const id = params.id as number

    const user = await getUser(id)

    try {
      await bouncer.with('UserPolicy').authorize('destroy', user)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const profile = await getProfile(id)
    const insameeProfile = await getInsameeProfile(id)
    const tutoratProfile = await getTutoratProfile(id)
    const associationsReports = await AssociationsReport.query().where('user_id', id).exec()
    const tutoratsReports = await TutoratsReport.query().where('user_id', id).exec()
    const tutorats = await Tutorat.query().where('user_id', id).exec()

    for (const tutorat of tutorats) {
      await tutorat.delete()
    }
    for (const report of associationsReports) {
      await report.delete()
    }
    for (const report of tutoratsReports) {
      await report.delete()
    }
    await insameeProfile.delete()
    await tutoratProfile.delete()
    await profile.delete()
    await user.delete()

    return {
      destroy: 'ok',
    }
  }
}
