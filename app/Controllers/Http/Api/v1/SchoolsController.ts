// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import School from 'App/Models/School'

export default class SchoolsController {
  public async index() {
    const schools = await School.query()
    return schools
  }
}
