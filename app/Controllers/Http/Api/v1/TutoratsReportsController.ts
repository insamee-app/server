import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Tutorat from 'App/Models/Tutorat'
import TutoratsReport from 'App/Models/TutoratsReport'
import { getTutorat } from 'App/Services/TutoratService'
import TutoratReportValidator from 'App/Validators/TutoratReportValidator'

export default class TutoratsReportsController {
  public async create({ params, auth, request }: HttpContextContract) {
    const { id } = params
    const { user } = auth
    const { reason, description } = await request.validate(TutoratReportValidator)

    await getTutorat(id)

    await TutoratsReport.create({
      userId: user!.id,
      reasonId: reason,
      description,
      tutoratId: id,
    })

    return {
      reported: 'ok',
    }
  }
}
