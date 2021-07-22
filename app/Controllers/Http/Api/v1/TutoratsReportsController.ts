import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TutoratsReport from 'App/Models/TutoratsReport'
import { getTutorat } from 'App/Services/TutoratService'
import TutoratReportValidator from 'App/Validators/TutoratReportValidator'

export default class TutoratsReportsController {
  public async create({ params, auth, request }: HttpContextContract) {
    const { id } = params
    const { user } = auth
    const { reason, description } = await request.validate(TutoratReportValidator)

    // Used to avoid to report an nonexisting tutorat
    await getTutorat(id)

    // Used to avoid to report an already reported tutorat (same user, same tutorat)
    // But deleted_at allow user to report a tutorat again, after a check by the admin
    try {
      await TutoratsReport.query().where('user_id', user!.id).where('tutorat_id', id).firstOrFail()
      return {
        reported: 'ok',
        already: true,
      }
    } catch (error) {
      await TutoratsReport.create({
        userId: user!.id,
        reasonId: reason,
        description,
        tutoratId: id,
      })
    }

    return {
      reported: 'ok',
      already: false,
    }
  }
}
