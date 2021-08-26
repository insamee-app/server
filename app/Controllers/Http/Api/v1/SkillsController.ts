import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import Skill from 'App/Models/Skill'
import { getSkill } from 'App/Services/SkillService'
import PlatformQueryValidator, { Platform } from 'App/Validators/PlatformQueryValidator'
import SkillValidator from 'App/Validators/SkillValidator'

export default class SkillsController {
  public async index({ request, bouncer }: HttpContextContract) {
    const { platform } = await request.validate(PlatformQueryValidator)

    const skills = Skill.query().orderBy('name')

    if (platform === Platform.ADMIN) {
      try {
        await bouncer.with('SkillPolicy').authorize('viewAdmin')
      } catch (error) {
        throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
      }

      return await skills.withTrashed()
    }

    const skillsJSON = (await skills).map((skill) =>
      skill.serialize({
        fields: {
          pick: ['id', 'name'],
        },
      })
    )

    return skillsJSON
  }

  public async store({ bouncer, request }: HttpContextContract) {
    try {
      await bouncer.with('SkillPolicy').authorize('store')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { name } = await request.validate(SkillValidator)

    const skill = await Skill.create({ name })

    return skill
  }

  public async update({ bouncer, params, request }: HttpContextContract) {
    try {
      await bouncer.with('SkillPolicy').authorize('update')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { id } = params
    const { name } = await request.validate(SkillValidator)

    const skill = await getSkill(id)

    skill.name = name

    await skill.save()

    return skill
  }

  public async destroy({ bouncer, params }: HttpContextContract) {
    try {
      await bouncer.with('SkillPolicy').authorize('destroy')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { id } = params

    const skill = await getSkill(id)

    skill.delete()

    return skill
  }

  public async restore({ bouncer, params }: HttpContextContract) {
    try {
      await bouncer.with('SkillPolicy').authorize('restore')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { id } = params

    const skill = await getSkill(id)

    skill.restore()

    return skill
  }
}
