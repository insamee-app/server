import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import NotFoundException from 'App/Exceptions/NotFoundException'

import FocusInterest from 'App/Models/FocusInterest'
import { getFocusInterest } from 'App/Services/FocusInterestService'
import PlatformQueryValidator, { Platform } from 'App/Validators/PlatformQueryValidator'
import FocusInterestValidator from 'App/Validators/FocusInterestValidator'

export default class FocusInterestsController {
  public async index({ request, bouncer }: HttpContextContract) {
    const { platform } = await request.validate(PlatformQueryValidator)

    const focusInterests = FocusInterest.query().orderBy('name')

    if (platform === Platform.ADMIN) {
      try {
        await bouncer.with('FocusInterestPolicy').authorize('viewAdmin')
      } catch (error) {
        throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
      }

      return await focusInterests.withTrashed()
    }

    const focusInterestsJSON = (await focusInterests).map((focusInterest) =>
      focusInterest.serialize({
        fields: {
          pick: ['id', 'name'],
        },
      })
    )

    return focusInterestsJSON
  }

  public async store({ bouncer, request }: HttpContextContract) {
    try {
      await bouncer.with('FocusInterestPolicy').authorize('store')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { name } = await request.validate(FocusInterestValidator)

    const focusInterest = await FocusInterest.create({ name })

    return focusInterest
  }

  public async update({ bouncer, params, request }: HttpContextContract) {
    try {
      await bouncer.with('FocusInterestPolicy').authorize('update')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { id } = params
    const { name } = await request.validate(FocusInterestValidator)

    const focusInterest = await getFocusInterest(id)

    focusInterest.name = name

    await focusInterest.save()

    return focusInterest
  }

  public async destroy({ bouncer, params }: HttpContextContract) {
    try {
      await bouncer.with('FocusInterestPolicy').authorize('destroy')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { id } = params

    const focusInterest = await getFocusInterest(id)

    focusInterest.delete()

    return focusInterest
  }
}
