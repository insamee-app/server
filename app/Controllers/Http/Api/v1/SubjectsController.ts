// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Subject from 'App/Models/Subject'

export default class SubjectsController {
  public async index() {
    const subjects = await Subject.query()

    return subjects
  }
}
