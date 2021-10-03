import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import Tutorat, { TutoratType } from 'App/Models/Tutorat'
import {
  filterTutorats,
  getTutorat,
  loadTutorat,
  tutoratCardSerialize,
  tutoratSerialize,
} from 'App/Services/TutoratService'
import TutoratQueryValidator from 'App/Validators/TutoratQueryValidator'
import TutoratUpdateValidator from 'App/Validators/TutoratUpdateValidator'
import TutoratValidator from 'App/Validators/TutoratValidator'
import SerializationQueryValidator, {
  Serialization,
} from 'App/Validators/SerializationQueryValidator'
import PaginateQueryValidator from 'App/Validators/PaginateQueryValidator'
import PlatformQueryValidator, { Platform } from 'App/Validators/PlatformQueryValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import InterestedInOfferEmail from 'App/Mailers/InterestedInOfferEmail'

export default class TutoratsController {
  private LIMIT = 20

  public async index({ request, bouncer }: HttpContextContract) {
    const { serialize } = await request.validate(SerializationQueryValidator)
    const { platform } = await request.validate(PlatformQueryValidator)
    const { page } = await request.validate(PaginateQueryValidator)
    const { subjects, currentRole, schools, type, time, siting } = await request.validate(
      TutoratQueryValidator
    )

    const queryTutorats = Tutorat.query()
      .withCount('usersInterested')
      .preload('school')
      .preload('subject')
      .preload('profile', (profile) => {
        profile.withTrashed()
      })

    const filteredTutorats = filterTutorats(
      queryTutorats,
      currentRole,
      type,
      subjects,
      schools,
      time,
      siting
    )

    if (serialize === Serialization.CARD && platform === Platform.TUTORAT) {
      const result = await filteredTutorats.paginate(page, this.LIMIT)

      return result.serialize(tutoratCardSerialize)
    } else if (
      platform === Platform.ADMIN &&
      (await bouncer.with('TutoratPolicy').allows('viewListAdmin'))
    ) {
      const result = await filteredTutorats.withTrashed().paginate(page, this.LIMIT)

      return result
    } else return []
  }

  public async show({ params, bouncer, request, auth }: HttpContextContract) {
    const { id } = params
    const { user } = auth

    const { platform } = await request.validate(PlatformQueryValidator)
    const { serialize } = await request.validate(SerializationQueryValidator)

    const tutorat = await getTutorat(id, user!.isAdmin)

    await loadTutorat(tutorat)

    if (platform === Platform.TUTORAT && serialize === Serialization.FULL) {
      return tutorat.serialize(tutoratSerialize)
    } else if (
      platform === Platform.ADMIN &&
      (await bouncer.with('TutoratPolicy').allows('showAdmin'))
    ) {
      return tutorat
    } else {
      return {}
    }
  }

  public async store({ auth, request }: HttpContextContract) {
    const { user } = auth

    const data = await request.validate(TutoratValidator)

    const rawTutorat: Partial<Tutorat> = {
      userId: user!.id,
      subjectId: data.subject,
      schoolId: data.school,
      time: data.type === TutoratType.OFFER ? data.time : (null as unknown as undefined),
      type: data.type ?? (null as unknown as undefined),
      text: data.text,
      siting: data.type === TutoratType.OFFER ? data.siting : (null as unknown as undefined),
    }

    const tutorat = await Tutorat.create(rawTutorat)

    if (tutorat.type === TutoratType.DEMAND) {
      await tutorat.related('usersInterested').attach([user!.id])
    }

    await loadTutorat(tutorat)

    // Send email to users who are interested in an demand when an offer is created
    if (data.type === TutoratType.OFFER) {
      // Used to get all users that are interested in a demand using subject and school from request
      const users = await Database.from('users')
        .whereIn(
          'id',
          // Get all users ids
          Database.from('interest_tutorat')
            .whereIn(
              'interest_tutorat.tutorat_id',
              // Get all tutorats ids that are related to the request (demands only)
              Database.from('tutorats')
                .where('tutorats.subject_id', '=', data.subject)
                .where('tutorats.school_id', '=', data.school)
                .where('tutorats.type', '=', TutoratType.DEMAND)
                .select('id')
            )
            .distinct('user_id')
        )
        // Only users that wants to receive an email
        .where('email_interested_tutorat', true)
        .innerJoin('profiles', 'profiles.user_id', '=', 'users.id')
        .select('users.email', 'profiles.first_name')

      if (users.length > 0) {
        // Send email to all users
        users.forEach(async (user) => {
          await new InterestedInOfferEmail(tutorat, user).sendLater()
        })
      }
    }

    return tutorat.serialize(tutoratSerialize)
  }

  public async update({ params, request, bouncer, auth }: HttpContextContract) {
    const { id } = params
    const { user } = auth

    const tutorat = await getTutorat(id, user!.isAdmin)

    try {
      await bouncer.with('TutoratPolicy').authorize('update', tutorat)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { text, time, siting } = await request.validate(TutoratUpdateValidator)
    const { platform } = await request.validate(PlatformQueryValidator)

    // We need to always send text and time for an offer. Optional allow us to remove data from a field
    tutorat.merge({
      text: text || (null as unknown as undefined),
      time:
        tutorat.type === TutoratType.OFFER
          ? time || (null as unknown as undefined)
          : (null as unknown as undefined),
      siting:
        tutorat.type === TutoratType.OFFER
          ? siting || (null as unknown as undefined)
          : (null as unknown as undefined),
    })

    await tutorat.save()

    await loadTutorat(tutorat)

    if (platform === Platform.TUTORAT) {
      return tutorat.serialize(tutoratSerialize)
    } else if (
      platform === Platform.ADMIN &&
      (await bouncer.with('TutoratPolicy').allows('showAdmin'))
    ) {
      return tutorat
    } else {
      return {}
    }
  }

  public async destroy({ params, bouncer, request }: HttpContextContract) {
    const { id } = params

    const { platform } = await request.validate(PlatformQueryValidator)

    const tutorat = await getTutorat(id)

    try {
      await bouncer.with('TutoratPolicy').authorize('delete', tutorat)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    await tutorat.delete()

    await loadTutorat(tutorat)

    if (platform === Platform.TUTORAT) {
      return tutorat.serialize(tutoratSerialize)
    } else if (
      platform === Platform.ADMIN &&
      (await bouncer.with('TutoratPolicy').allows('showAdmin'))
    ) {
      return tutorat
    } else {
      return {}
    }
  }

  public async restore({ bouncer, params, auth }: HttpContextContract) {
    try {
      await bouncer.with('TutoratPolicy').authorize('restore')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { id } = params
    const { user } = auth

    const tutorat = await getTutorat(id, user!.isAdmin)

    tutorat.restore()

    await loadTutorat(tutorat)

    return tutorat
  }
}
