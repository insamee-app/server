import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Association from 'App/Models/Association'
import Profile from 'App/Models/Profile'
import AssociationQueryValidator from 'App/Validators/AssociationQueryValidator'

export default class AssociationsController {
  public async index({ request }: HttpContextContract) {
    const associationsQuery = Association.query()
      .preload('school')
      .preload('tags')
      .preload('thematic')

    const { page, limit } = await request.validate(AssociationQueryValidator)

    const result =
      page || limit
        ? await associationsQuery.paginate(page ?? 1, limit ?? 5)
        : associationsQuery.exec()

    return result
  }

  public async show({ params }: HttpContextContract) {
    const { id } = params

    const association = await Association.findOrFail(id)

    await association.load('school')
    await association.load('tags')
    await association.load('thematic')

    return association
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
