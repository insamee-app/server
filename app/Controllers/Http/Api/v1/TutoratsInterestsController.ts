import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import Profile from 'App/Models/Profile'
import { insameeProfileCardSerialize, profileCardSerialize } from 'App/Services/ProfileService'
import { getTutorat } from 'App/Services/TutoratService'
import PaginateQueryValidator from 'App/Validators/PaginateQueryValidator'

export default class TutoratsInterestsController {
  public async index({ request, params, bouncer }: HttpContextContract) {
    const { id } = params

    const tutorat = await getTutorat(id)

    try {
      await bouncer.with('TutoratPolicy').authorize('viewProfilesList', tutorat)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { page } = await request.validate(PaginateQueryValidator)

    const queryProfiles = Profile.query()
      .whereIn(
        'user_id',
        Database.from('interest_tutorat').select('user_id').where('tutorat_id', '=', id)
      )
      .preload('insameeProfile', (profile) => {
        profile.preload('associations')
        profile.preload('skills')
      })

    const result = await queryProfiles.paginate(page, 6)

    const serialize = profileCardSerialize
    serialize.relations!.insamee_profile = insameeProfileCardSerialize
    return result.serialize(serialize)
  }

  public async show({ params, auth }: HttpContextContract) {
    const { id } = params
    const { user } = auth

    try {
      await Database.from('interest_tutorat')
        .where('user_id', user!.id)
        .andWhere('tutorat_id', id)
        .firstOrFail()
      return {
        interested: true,
      }
    } catch (error) {
      return {
        interested: false,
      }
    }
  }

  public async store({ auth, params }: HttpContextContract) {
    const { user } = auth
    const { id } = params

    const related = await Database.from('interest_tutorat').where('user_id', user!.id)
    const relatedIds = related.map((r) => r.tutorat_id)

    if (!relatedIds.includes(+id)) await user!.related('tutoratsInterested').attach([id])

    return {
      interested: true,
    }
  }

  public async destroy({ auth, params }: HttpContextContract) {
    const { user } = auth
    const { id } = params

    await user!.related('tutoratsInterested').detach([id])

    return {
      interested: false,
    }
  }

  public async contact({ params, bouncer }: HttpContextContract) {
    const { id } = params

    const tutorat = await getTutorat(id)

    try {
      await bouncer.with('TutoratPolicy').authorize('viewProfilesList', tutorat)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const users = await tutorat.related('usersInterested').query().select('email')

    return {
      mailto: `mailto:${users.map((user) => user.email).join(';')}`,
    }
  }
}
