import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotFoundException from 'App/Exceptions/NotFoundException'
import Association from 'App/Models/Association'
import AssociationsReport from 'App/Models/AssociationsReport'
import AssociationReportValidator from 'App/Validators/AssociationReportValidator'

export default class AssociationsReportsController {
  public async create({ params, auth, request }: HttpContextContract) {
    const { id } = params
    const { user } = auth
    const { reason, description } = await request.validate(AssociationReportValidator)

    try {
      await Association.findOrFail(id)
    } catch (e) {
      throw new NotFoundException('Association introuvable')
    }

    await AssociationsReport.create({
      userId: user!.id,
      reasonId: reason,
      description,
      associationId: id,
    })

    return {
      reported: 'ok',
    }
  }
}
