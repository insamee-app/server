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

    // Used to avait to report an non existing association
    try {
      await Association.findOrFail(id)
    } catch (e) {
      throw new NotFoundException('Association introuvable')
    }

    // Used to avoid to report an already reported association (same user, same association)
    // But deleted_at allow user to report a association again, after a check by the admin
    try {
      await AssociationsReport.query()
        .where('user_id', user!.id)
        .where('association_id', id)
        .firstOrFail()
      return {
        reported: 'ok',
        already: true,
      }
    } catch (error) {
      await AssociationsReport.create({
        userId: user!.id,
        reasonId: reason,
        description,
        associationId: id,
      })
    }

    return {
      reported: 'ok',
      already: false,
    }
  }
}
