import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CherryPick } from '@ioc:Adonis/Lucid/Orm'
import AssociationsReason from 'App/Models/AssociationsReason'
import ProfilesReason from 'App/Models/ProfilesReason'
import TutoratsReason from 'App/Models/TutoratsReason'
import PlatformValidator, { Platform } from 'App/Validators/PlatformValidator'

const reasonSerialize: CherryPick = {
  fields: ['name', 'id'],
}

export default class ReasonsController {
  public async index({ request }: HttpContextContract) {
    const { platform } = await request.validate(PlatformValidator)

    if (platform === Platform.ASSOCIATIONS) {
      const reasons = await AssociationsReason.all()
      return reasons.map((reason) => reason.serialize(reasonSerialize))
    } else if (platform === Platform.TUTORAT) {
      const reasons = await TutoratsReason.all()
      return reasons.map((reason) => reason.serialize(reasonSerialize))
    } else if (platform === Platform.INSAMEE) {
      const reasons = await ProfilesReason.all()
      return reasons.map((reason) => reason.serialize(reasonSerialize))
    } else {
      return []
    }
  }
}
