// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Association from 'App/Models/Association'

export default class AssociationsController {
  public async index() {
    const associations = await Association.query().preload('school')
    return associations
  }
}
