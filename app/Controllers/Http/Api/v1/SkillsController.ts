// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Skill from 'App/Models/Skill'

export default class SkillsController {
  public async index() {
    const skills = await Skill.query()
    return skills
  }
}
