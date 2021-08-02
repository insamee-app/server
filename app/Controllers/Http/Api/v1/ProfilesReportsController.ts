import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProfilesReport from 'App/Models/ProfilesReport'
import { getProfile } from 'App/Services/ProfileService'
import ProfileReportValidator from 'App/Validators/ProfileReportValidator'

export default class ProfilesReportsController {
  public async create({ params, auth, request }: HttpContextContract) {
    const { id } = params
    const { user } = auth
    const { reason, description } = await request.validate(ProfileReportValidator)

    await getProfile(id)

    // Used to avoid to report an already reported association (same user, same association)
    // But deleted_at allow user to report a association again, after a check by the admin
    try {
      await ProfilesReport.query().where('user_id', user!.id).where('profile_id', id).firstOrFail()
      return {
        reported: 'ok',
        already: true,
      }
    } catch (error) {
      await ProfilesReport.create({
        userId: user!.id,
        reasonId: reason,
        description,
        profileId: id,
      })
    }

    return {
      reported: 'ok',
      already: false,
    }
  }
}
