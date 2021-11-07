import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import School from 'App/Models/School'
import { getSchool } from 'App/Services/SchoolService'
import PlatformQueryValidator, { Platform } from 'App/Validators/PlatformQueryValidator'
import SchoolValidator from 'App/Validators/SchoolValidator'

export default class SchoolsController {
  public async index({ request, bouncer }: HttpContextContract) {
    const { platform } = await request.validate(PlatformQueryValidator)

    const schools = School.query().orderBy('name')

    if (platform === Platform.ADMIN && (await bouncer.with('SchoolPolicy').allows('viewAdmin'))) {
      return await schools.withTrashed()
    } else {
      const schoolsJSON = (await schools).map((school) =>
        school.serialize({
          fields: {
            pick: ['id', 'name'],
          },
        })
      )

      return schoolsJSON
    }
  }

  public async store({ bouncer, request }: HttpContextContract) {
    try {
      await bouncer.with('SchoolPolicy').authorize('store')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { name, host } = await request.validate(SchoolValidator)

    const school = await School.create({ name, host })

    return school
  }

  public async update({ bouncer, params, request }: HttpContextContract) {
    try {
      await bouncer.with('SchoolPolicy').authorize('update')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { id } = params
    const { name, host } = await request.validate(SchoolValidator)

    const school = await getSchool(id)

    school.name = name
    school.host = host

    await school.save()

    return school
  }

  public async destroy({ bouncer, params }: HttpContextContract) {
    try {
      await bouncer.with('SchoolPolicy').authorize('destroy')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { id } = params

    const school = await getSchool(id)

    await school.delete()

    // Revoke all tokens from users of this school
    await Database.from('users')
      .whereIn('id', Database.from('profiles').where('school_id', id).select('user_id'))
      .update({ remember_me_token: null })

    return school
  }

  public async restore({ bouncer, params }: HttpContextContract) {
    try {
      await bouncer.with('SchoolPolicy').authorize('restore')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { id } = params

    const school = await getSchool(id)

    school.restore()

    return school
  }
}
