import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import NotFoundException from 'App/Exceptions/NotFoundException'

import Subject from 'App/Models/Subject'
import { getSubject } from 'App/Services/SubjectService'
import PlatformQueryValidator, { Platform } from 'App/Validators/PlatformQueryValidator'
import SubjectValidator from 'App/Validators/SubjectValidator'

export default class SubjectsController {
  public async index({ request, bouncer }: HttpContextContract) {
    const { platform } = await request.validate(PlatformQueryValidator)

    const subjects = Subject.query().orderBy('name')

    if (platform === Platform.ADMIN) {
      try {
        await bouncer.with('SubjectPolicy').authorize('viewAdmin')
      } catch (error) {
        throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
      }

      return await subjects.withTrashed()
    }

    const subjectsJSON = (await subjects).map((subject) =>
      subject.serialize({
        fields: {
          pick: ['id', 'name'],
        },
      })
    )

    return subjectsJSON
  }

  public async store({ bouncer, request }: HttpContextContract) {
    try {
      await bouncer.with('SubjectPolicy').authorize('store')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { name } = await request.validate(SubjectValidator)

    const subject = await Subject.create({ name })

    return subject
  }

  public async update({ bouncer, params, request }: HttpContextContract) {
    try {
      await bouncer.with('SubjectPolicy').authorize('update')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { id } = params
    const { name } = await request.validate(SubjectValidator)

    const subject = await getSubject(id)

    subject.name = name

    await subject.save()

    return subject
  }

  public async destroy({ bouncer, params }: HttpContextContract) {
    try {
      await bouncer.with('SubjectPolicy').authorize('destroy')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { id } = params

    const subject = await getSubject(id)

    subject.delete()

    return subject
  }
}
