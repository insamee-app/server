import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CherryPick } from '@ioc:Adonis/Lucid/Orm'
import AssociationsReason from 'App/Models/AssociationsReason'
import ProfilesReason from 'App/Models/ProfilesReason'
import TutoratsReason from 'App/Models/TutoratsReason'
import { Resource } from 'App/Services/ReportService'
import ResourceQueryValidator from 'App/Validators/ResourceQueryValidator'

const reasonSerialize: CherryPick = {
  fields: ['name', 'id'],
}

export default class ReasonsController {
  public async index({ request }: HttpContextContract) {
    const { resource } = await request.validate(ResourceQueryValidator)

    if (resource === Resource.ASSOCIATIONS) {
      const reasons = await AssociationsReason.all()
      return reasons.map((reason) => reason.serialize(reasonSerialize))
    } else if (resource === Resource.TUTORATS) {
      const reasons = await TutoratsReason.all()
      return reasons.map((reason) => reason.serialize(reasonSerialize))
    } else if (resource === Resource.PROFILES) {
      const reasons = await ProfilesReason.all()
      return reasons.map((reason) => reason.serialize(reasonSerialize))
    } else {
      return []
    }
  }
}
