import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Association from 'App/Models/Association'
import Profile from 'App/Models/Profile'
import AssociationQueryValidator from 'App/Validators/AssociationQueryValidator'
import { insameeProfile } from 'App/Validators/messages'

export default class AssociationsController {
  public async index() {
    const associations = await Association.query()
      .preload('school')
      .preload('tags')
      .preload('thematic')
    return associations
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
