import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import Tag from 'App/Models/Tag'
import { getTag } from 'App/Services/TagService'
import PlatformQueryValidator, { Platform } from 'App/Validators/PlatformQueryValidator'
import TagValidator from 'App/Validators/TagValidator'

export default class TagsController {
  public async index({ request, bouncer }: HttpContextContract) {
    const { platform } = await request.validate(PlatformQueryValidator)

    const tags = Tag.query().orderBy('name')

    if (platform === Platform.ADMIN && (await bouncer.with('TagPolicy').allows('viewAdmin'))) {
      return await tags.withTrashed()
    } else {
      const tagsJSON = (await tags).map((tag) =>
        tag.serialize({
          fields: {
            pick: ['id', 'name'],
          },
        })
      )

      return tagsJSON
    }
  }

  public async store({ bouncer, request }: HttpContextContract) {
    try {
      await bouncer.with('TagPolicy').authorize('store')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { name } = await request.validate(TagValidator)

    const tag = await Tag.create({ name })

    return tag
  }

  public async update({ bouncer, params, request }: HttpContextContract) {
    try {
      await bouncer.with('TagPolicy').authorize('update')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { id } = params
    const { name } = await request.validate(TagValidator)

    const tag = await getTag(id)

    tag.name = name

    await tag.save()

    return tag
  }

  public async destroy({ bouncer, params }: HttpContextContract) {
    try {
      await bouncer.with('TagPolicy').authorize('destroy')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { id } = params

    const tag = await getTag(id)

    tag.delete()

    return tag
  }

  public async restore({ bouncer, params }: HttpContextContract) {
    try {
      await bouncer.with('TagPolicy').authorize('restore')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { id } = params

    const tag = await getTag(id)

    tag.restore()

    return tag
  }
}
