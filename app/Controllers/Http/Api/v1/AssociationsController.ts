import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Association from 'App/Models/Association'
import Profile from 'App/Models/Profile'
import AssociationQueryValidator from 'App/Validators/AssociationQueryValidator'
import SerializationQueryValidator, {
  Serialization,
} from 'App/Validators/SerializationQueryValidator'

export default class AssociationsController {
  public async index({ request }: HttpContextContract) {
    const { serialize } = await request.validate(SerializationQueryValidator)

    const associationsQuery = Association.query()
      .preload('school')
      .preload('tags')
      .preload('thematic')

    const { page, limit } = await request.validate(AssociationQueryValidator)

    const result = await associationsQuery.paginate(page ?? 1, limit ?? 5)

    if (serialize === Serialization.CARD)
      return result.serialize({
        fields: ['id', 'name', 'imageUrl', 'shortText'],
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

    return result
  }

  public async show({ params }: HttpContextContract) {
    const { id } = params

    const association = await Association.findOrFail(id)

    await association.load('school')
    await association.load('tags')
    await association.load('thematic')

    return association.serialize({
      fields: ['id', 'name', 'imageUrl', 'text'],
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

  public async profiles({ params, request }: HttpContextContract) {
    const { id } = params

    const { page, limit } = await request.validate(AssociationQueryValidator)

    const profiles = await Profile.query()
      .whereExists((query) => {
        query
          .from('users')
          .whereColumn('users.id', 'profiles.user_id')
          .where('users.is_verified', true)
      })
      .join(
        'association_insamee_profile',
        'profiles.user_id',
        '=',
        'association_insamee_profile.user_id'
      )
      .where('association_insamee_profile.association_id', '=', id)
      .preload('insameeProfile', (insameeProfile) => {
        insameeProfile.preload('associations')
        insameeProfile.preload('skills')
      })
      .preload('school')
      .paginate(page ?? 1, limit ?? 5)

    return profiles
  }
}
