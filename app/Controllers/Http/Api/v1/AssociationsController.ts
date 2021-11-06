import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import Association from 'App/Models/Association'
import Profile from 'App/Models/Profile'
import {
  filterAssociations,
  getAssociation,
  loadAssociation,
} from 'App/Services/AssociationService'
import { insameeProfileCardSerialize, profileCardSerialize } from 'App/Services/ProfileService'
import AssociationQueryValidator from 'App/Validators/AssociationQueryValidator'
import AssociationUpdateValidator from 'App/Validators/AssociationUpdateValidator'
import AssociationValidator from 'App/Validators/AssociationValidator'
import PaginateQueryValidator from 'App/Validators/PaginateQueryValidator'
import PlatformQueryValidator, { Platform } from 'App/Validators/PlatformQueryValidator'
import SerializationQueryValidator, {
  Serialization,
} from 'App/Validators/SerializationQueryValidator'

export default class AssociationsController {
  private LIMITE = 20

  public async index({ request, bouncer }: HttpContextContract) {
    const { serialize } = await request.validate(SerializationQueryValidator)
    const { platform } = await request.validate(PlatformQueryValidator)

    if (serialize === Serialization.CARD) {
      const { page } = await request.validate(PaginateQueryValidator)
      const { name, thematics, tags, schools } = await request.validate(AssociationQueryValidator)

      const queryAssociations = Association.query()
        .preload('school')
        .preload('tags')
        .preload('thematic')

      const filteredAssociations = filterAssociations(
        queryAssociations,
        name,
        thematics,
        tags,
        schools
      )

      const result = await filteredAssociations.paginate(page, this.LIMITE)

      return result.serialize({
        fields: ['id', 'name', 'image_url', 'short_text'],
        relations: {
          school: {
            fields: ['name'],
          },
          thematic: {
            fields: ['name'],
          },
          tags: {
            fields: ['name'],
          },
        },
      })
    } else if (serialize === Serialization.FILTER) {
      const associations = await Association.query().orderBy('name').preload('school')
      const associationsJSON = associations.map((association) =>
        association.serialize({
          fields: ['id', 'name'],
          relations: {
            school: {
              fields: ['name'],
            },
          },
        })
      )

      return associationsJSON
    } else if (
      platform === Platform.ADMIN &&
      (await bouncer.with('AssociationPolicy').allows('viewAdmin'))
    ) {
      const { page } = await request.validate(PaginateQueryValidator)

      const associations = await Association.withTrashed()
        .preload('school')
        .preload('tags')
        .preload('thematic')
        .paginate(page, this.LIMITE)

      return associations.serialize({
        fields: [
          'id',
          'name',
          'url_picture',
          'email',
          'text',
          'created_at',
          'updated_at',
          'deleted_at',
        ],
        relations: {
          school: {
            fields: ['name'],
          },
          thematic: {
            fields: ['id', 'name'],
          },
          tags: {
            fields: ['id', 'name'],
          },
        },
      })
    } else return []
  }

  public async show({ params, bouncer, request }: HttpContextContract) {
    const { id } = params
    const { platform } = await request.validate(PlatformQueryValidator)

    const association = await getAssociation(id)

    await loadAssociation(association)

    if (
      platform === Platform.ADMIN &&
      (await bouncer.with('AssociationPolicy').allows('showAdmin'))
    ) {
      return association
    } else {
      return association.serialize({
        fields: ['id', 'name', 'url_picture', 'text', 'email'],
        relations: {
          school: {
            fields: ['name'],
          },
          thematic: {
            fields: ['name'],
          },
          tags: {
            fields: ['name'],
          },
        },
      })
    }
  }

  public async store({ bouncer, request }: HttpContextContract) {
    try {
      await bouncer.with('AssociationPolicy').authorize('store')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { name, text, email, schoolId, thematicId, tags } = await request.validate(
      AssociationValidator
    )

    const association = await Association.create({ name, text, email, schoolId, thematicId })
    if (tags) await association.related('tags').attach(tags)

    await loadAssociation(association)

    return association
  }

  public async update({ bouncer, params, request, auth }: HttpContextContract) {
    try {
      await bouncer.with('AssociationPolicy').authorize('update')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { id } = params
    const { user } = auth
    const { tags, ...data } = await request.validate(AssociationUpdateValidator)

    const association = await getAssociation(id, user!.isAdmin)

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key]
        association[key] = element || null
      }
    }

    await association.save()
    if (tags) await association.related('tags').sync(tags)

    await loadAssociation(association)

    return association
  }

  public async destroy({ bouncer, params, auth }: HttpContextContract) {
    try {
      await bouncer.with('AssociationPolicy').authorize('destroy')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { id } = params
    const { user } = auth

    const association = await getAssociation(id, user!.isAdmin)

    association.delete()

    await loadAssociation(association)

    return association
  }

  public async restore({ bouncer, params, auth }: HttpContextContract) {
    try {
      await bouncer.with('AssociationPolicy').authorize('restore')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { id } = params
    const { user } = auth

    const association = await getAssociation(id, user!.isAdmin)

    association.restore()

    await loadAssociation(association)

    return association
  }

  public async profiles({ params, request }: HttpContextContract) {
    const { id } = params

    const { page } = await request.validate(PaginateQueryValidator)

    const profiles = await Profile.query()
      .join(
        'association_insamee_profile',
        'profiles.user_id',
        '=',
        'association_insamee_profile.user_id'
      )
      .whereIn('profiles.user_id', Database.from('users').select('id').where('is_verified', true))
      .where('association_insamee_profile.association_id', '=', id)
      .preload('insameeProfile', (insameeProfile) => {
        insameeProfile.preload('associations')
        insameeProfile.preload('focusInterests')
      })
      .paginate(page, 6)

    const serialize = profileCardSerialize
    serialize.relations = { insamee_profile: insameeProfileCardSerialize }
    return profiles.serialize(serialize)
  }
}
