import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import Tutorat, { TutoratType } from 'App/Models/Tutorat'
import { filterTutorats, getTutorat, loadTutorat } from 'App/Services/TutoratService'
import TutoratQueryValidator from 'App/Validators/TutoratQueryValidator'
import TutoratUpdateValidator from 'App/Validators/TutoratUpdateValidator'
import TutoratValidator from 'App/Validators/TutoratValidator'

export default class TutoratsController {
  public async index({ request }: HttpContextContract) {
    const tutorats = filterTutorats(request, TutoratQueryValidator)

    return tutorats
  }

  public async show({ params }: HttpContextContract) {
    const id = params.id as number

    const tutorat = await getTutorat(id)

    await loadTutorat(tutorat)

    return tutorat
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
}
