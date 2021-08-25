import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import NotFoundException from 'App/Exceptions/NotFoundException'

import Thematic from 'App/Models/Thematic'
import { getThematic } from 'App/Services/ThematicService'
import PlatformQueryValidator, { Platform } from 'App/Validators/PlatformQueryValidator'
import ThematicValidator from 'App/Validators/ThematicValidator'

export default class ThematicsController {
  public async index({ request, bouncer }: HttpContextContract) {
    const { platform } = await request.validate(PlatformQueryValidator)

    const thematics = Thematic.query().orderBy('name')

    if (platform === Platform.ADMIN) {
      try {
        await bouncer.with('ThematicPolicy').authorize('viewAdmin')
      } catch (error) {
        throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
      }

      return await thematics.withTrashed()
    }

    const thematicsJSON = (await thematics).map((thematic) =>
      thematic.serialize({
        fields: {
          pick: ['id', 'name'],
        },
      })
    )

    return thematicsJSON
  }

  public async store({ bouncer, request }: HttpContextContract) {
    try {
      await bouncer.with('ThematicPolicy').authorize('store')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { name } = await request.validate(ThematicValidator)

    const thematic = await Thematic.create({ name })

    return thematic
  }

  public async update({ bouncer, params, request }: HttpContextContract) {
    try {
      await bouncer.with('ThematicPolicy').authorize('update')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { id } = params
    const { name } = await request.validate(ThematicValidator)

    const thematic = await getThematic(id)

    thematic.name = name

    await thematic.save()

    return thematic
  }

  public async destroy({ bouncer, params }: HttpContextContract) {
    try {
      await bouncer.with('ThematicPolicy').authorize('destroy')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { id } = params

    const thematic = await getThematic(id)

    thematic.delete()

    return thematic
  }
}
