import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Profile from 'App/Models/Profile'
import { insameeProfileCardSerialize, profileCardSerialize } from 'App/Services/ProfileService'
import { getTutorat } from 'App/Services/TutoratService'
import PaginateQueryValidator from 'App/Validators/PaginateQueryValidator'

export default class TutoratsInterestsController {
  public async index({ params, request }: HttpContextContract) {
    const { id } = params

    // TODO: Only for creator
    const { page } = await request.validate(PaginateQueryValidator)

    const queryProfiles = Profile.query()
      .whereIn(
        'user_id',
        Database.from('registration_tutorat').select('user_id').where('tutorat_id', '=', id)
      )
      .preload('insameeProfile', (insameeProfile) => {
        insameeProfile.preload('associations')
        insameeProfile.preload('focusInterests')
      })
      .whereNull('profiles.deleted_at')

    const result = await queryProfiles.paginate(page, 6)

    const serialize = profileCardSerialize
    serialize.relations = { insamee_profile: insameeProfileCardSerialize }
    return result.serialize(serialize)
  }

  public async store({ auth, params }: HttpContextContract) {
    const { user } = auth
    const { id } = params

    const related = await Database.from('registration_tutorat').where('user_id', user!.id)
    const relatedIds = related.map((r) => r.tutorat_id)

    if (!relatedIds.includes(+id)) await user!.related('tutoratsInterested').attach([id])

    return {
      registration: 'ok',
    }
  }

  public async destroy({ auth, params }: HttpContextContract) {
    const { user } = auth
    const { id } = params

    await user!.related('tutoratsInterested').detach([id])

    return {
      deregistration: 'ok',
    }
  }

  public async contact({ params }: HttpContextContract) {
    const { id } = params

    const tutorat = await getTutorat(id)
    const users = await tutorat.related('usersInterested').query().select('email')

    return {
      mailto: `mailto:${users.map((user) => user.email).join(';')}`,
    }
  }
}
