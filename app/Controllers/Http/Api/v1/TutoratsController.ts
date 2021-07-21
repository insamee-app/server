import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import Tutorat, { TutoratType } from 'App/Models/Tutorat'
import { filterTutorats, getTutorat, loadTutorat } from 'App/Services/TutoratService'
import TutoratQueryValidator from 'App/Validators/TutoratQueryValidator'
import TutoratUpdateValidator from 'App/Validators/TutoratUpdateValidator'
import TutoratValidator from 'App/Validators/TutoratValidator'
import SerializationQueryValidator, {
  Serialization,
} from 'App/Validators/SerializationQueryValidator'
import InternalServerErrorException from 'App/Exceptions/InternalServerErrorException'
import Database from '@ioc:Adonis/Lucid/Database'

const LIMIT = 20
export default class TutoratsController {
  public async index({ request }: HttpContextContract) {
    const { serialize } = await request.validate(SerializationQueryValidator)
    const { page, subjects, currentRole, schools, type, time } = await request.validate(
      TutoratQueryValidator
    )

    const queryTutorats = Tutorat.query().preload('school').preload('subject').preload('profile')

    const filteredTutorats = filterTutorats(
      queryTutorats,
      currentRole,
      type,
      subjects,
      schools,
      time
    )

    const result = await filteredTutorats.paginate(page ?? 1, LIMIT)

    if (serialize === Serialization.CARD)
      return result.serialize({
        fields: ['type', 'short_text', 'time', 'id'],
        relations: {
          school: {
            fields: ['name'],
          },
          subject: {
            fields: ['name'],
          },
          profile: {
            fields: ['avatar_url', 'last_name', 'first_name', 'current_role'],
          },
        },
      })
    else return {}
  }

  public async show({ params }: HttpContextContract) {
    const id = params.id as number

    const tutorat = await getTutorat(id)

    await loadTutorat(tutorat)

    return tutorat.serialize({
      fields: ['type', 'text', 'time'],
      relations: {
        school: {
          fields: ['name'],
        },
        subject: {
          fields: ['name'],
        },
        profile: {
          fields: ['avatar_url', 'last_name', 'first_name', 'current_role'],
          relations: {
            user: {
              fields: ['email'],
            },
          },
        },
      },
    })
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
    }

    const tutorat = await Tutorat.create(rawTutorat)

    await loadTutorat(tutorat)

    return tutorat
  }

  public async update({ params, request, bouncer }: HttpContextContract) {
    const { id } = params

    const tutorat = await getTutorat(id)

    try {
      await bouncer.with('TutoratPolicy').authorize('update', tutorat)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { text, time } = await request.validate(TutoratUpdateValidator)

    // We need to always send text and time for an offer. Optional allow us to remove data from a field
    tutorat.merge({
      text: text || (null as unknown as undefined),
      time:
        tutorat.type === TutoratType.OFFER
          ? time || (null as unknown as undefined)
          : (null as unknown as undefined),
    })

    await tutorat.save()

    await loadTutorat(tutorat)

    return tutorat
  }

  public async destroy({ params, bouncer }: HttpContextContract) {
    const { id } = params

    const tutorat = await getTutorat(id)

    try {
      await bouncer.with('TutoratPolicy').authorize('delete', tutorat)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    await tutorat.delete()

    return {
      destroy: 'ok',
    }
  }

  public async registration({ auth, params }: HttpContextContract) {
    const { user } = auth
    const { id } = params

    const related = await Database.from('registration_tutorat').where('user_id', user!.id)
    const relatedIds = related.map((r) => r.tutorat_id)

    if (!relatedIds.includes(+id)) await user!.related('tutoratsRegistrations').attach([id])

    return {
      registration: 'ok',
    }
  }

  public async deregistration({ auth, params }: HttpContextContract) {
    const { user } = auth
    const { id } = params

    await user!.related('tutoratsRegistrations').detach([id])

    return {
      deregistration: 'ok',
    }
  }

  public async contact({ params }: HttpContextContract) {
    const { id } = params

    const tutorat = await getTutorat(id)
    const users = await tutorat.related('usersRegistrations').query().select('email')

    return {
      mailto: `mailto:${users.map((user) => user.email).join(';')}`,
    }
  }
}
