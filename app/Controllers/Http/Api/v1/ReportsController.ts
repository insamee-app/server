import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import AssociationsReport from 'App/Models/AssociationsReport'
import ProfilesReport from 'App/Models/ProfilesReport'
import TutoratsReport from 'App/Models/TutoratsReport'
import ReportValidator from 'App/Validators/ReportValidator'

export enum Resource {
  PROFILES = 'profiles',
  TUTORATS = 'tutorats',
  ASSOCIATIONS = 'associations',
}

export default class ReportsController {
  public async index({ params, request, bouncer }: HttpContextContract) {
    try {
      await bouncer.with('ReportPolicy').authorize('view')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { resource } = params as { resource: Resource }
    const { page } = await request.validate(ReportValidator)

    switch (resource) {
      case Resource.PROFILES:
        const profileReports = await ProfilesReport.query()
          .preload('profile')
          .preload('user')
          .preload('reason')
          .paginate(page ?? 1, 20)
        return profileReports
      case Resource.TUTORATS:
        const tutoratsReports = await TutoratsReport.query()
          .preload('tutorat')
          .preload('user')
          .preload('reason')
          .paginate(page ?? 1, 20)
        return tutoratsReports
      case Resource.ASSOCIATIONS:
        const associationsReports = await AssociationsReport.query()
          .preload('association')
          .preload('user')
          .preload('reason')
          .paginate(page ?? 1, 20)
        return associationsReports
      default:
        throw new Error(`Resource ${resource} not found`)
    }
  }
}
