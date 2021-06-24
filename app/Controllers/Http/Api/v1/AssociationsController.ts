// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Association from 'App/Models/Association'

export default class AssociationsController {
  public async index() {
    const associations = await Association.query()
      .preload('school')
      .preload('tags')
      .preload('thematic')
    return associations
  }
}
