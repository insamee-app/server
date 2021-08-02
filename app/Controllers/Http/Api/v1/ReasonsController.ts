import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CherryPick } from '@ioc:Adonis/Lucid/Orm'
import AssociationsReason from 'App/Models/AssociationsReason'
import TutoratsReason from 'App/Models/TutoratsReason'
import ReasonQueryValidator from 'App/Validators/ReasonQueryValidator'

export enum Platform {
  INSAMEE = 'insamee',
  TUTORAT = 'tutorat',
  ASSOCIATIONS = 'associations',
}

const reasonSerialize: CherryPick = {
  fields: ['name', 'id'],
}

export default class ReasonsController {
  public async index({ request }: HttpContextContract) {
    const { platform } = await request.validate(ReasonQueryValidator)

    if (platform === Platform.ASSOCIATIONS) {
      const reasons = await AssociationsReason.all()
      return reasons.map((reason) => reason.serialize(reasonSerialize))
    } else if (platform === Platform.TUTORAT) {
      const reasons = await TutoratsReason.all()
      return reasons.map((reason) => reason.serialize(reasonSerialize))
    } else if (plateform === Platform.INSAMEE) {
      // const reasons = await
    } else {
      return []
    }
  }
}
