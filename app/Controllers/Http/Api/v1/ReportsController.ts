import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import AssociationsReport from 'App/Models/AssociationsReport'
import ProfilesReport from 'App/Models/ProfilesReport'
import TutoratsReport from 'App/Models/TutoratsReport'
import ReportValidator from 'App/Validators/ReportValidator'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import NotFoundException from 'App/Exceptions/NotFoundException'

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

    let reportsQuery: ModelQueryBuilderContract<
      typeof ProfilesReport | typeof TutoratsReport | typeof AssociationsReport,
      ProfilesReport | TutoratsReport | AssociationsReport
    >
    switch (resource) {
      case Resource.PROFILES:
        reportsQuery = ProfilesReport.query().preload('profile').preload('user').preload('reason')
        break
      case Resource.TUTORATS:
        reportsQuery = TutoratsReport.query().preload('tutorat').preload('user').preload('reason')
        break
      case Resource.ASSOCIATIONS:
        reportsQuery = AssociationsReport.query()
          .preload('association')
          .preload('user')
          .preload('reason')
        break
      default:
        throw new Error(`Resource ${resource} not found`)
    }

    const reports = await reportsQuery.withTrashed().paginate(page ?? 1, 20)

    return reports
  }

  public async show({ params, bouncer }: HttpContextContract) {
    try {
      await bouncer.with('ReportPolicy').authorize('view')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { resource, id } = params as { resource: Resource; id: number }

    let reportQuery: ModelQueryBuilderContract<
      typeof ProfilesReport | typeof TutoratsReport | typeof AssociationsReport,
      ProfilesReport | TutoratsReport | AssociationsReport
    >
    switch (resource) {
      case Resource.PROFILES:
        reportQuery = ProfilesReport.query()
        break
      case Resource.TUTORATS:
        reportQuery = TutoratsReport.query()
        break
      case Resource.ASSOCIATIONS:
        reportQuery = AssociationsReport.query()
        break
      default:
        throw new Error(`Resource ${resource} not found`)
    }

    let report: ProfilesReport | TutoratsReport | AssociationsReport
    try {
      report = await reportQuery.withTrashed().where('id', id).firstOrFail()
    } catch (error) {
      throw new NotFoundException('Signalement introuvable')
    }
    return report
  }

  public async destroy({ params, request, bouncer }: HttpContextContract) {
    try {
      await bouncer.with('ReportPolicy').authorize('destroy')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { resource, id } = params as { resource: Resource; id: number }

    let reportQuery: ModelQueryBuilderContract<
      typeof ProfilesReport | typeof TutoratsReport | typeof AssociationsReport,
      ProfilesReport | TutoratsReport | AssociationsReport
    >
    switch (resource) {
      case Resource.PROFILES:
        reportQuery = ProfilesReport.query()
        break
      case Resource.TUTORATS:
        reportQuery = TutoratsReport.query()
        break
      case Resource.ASSOCIATIONS:
        reportQuery = AssociationsReport.query()
        break
      default:
        throw new Error(`Resource ${resource} not found`)
    }

    let report: ProfilesReport | TutoratsReport | AssociationsReport
    try {
      report = await reportQuery.where('id', id).firstOrFail()
    } catch (error) {
      throw new NotFoundException('Signalement introuvable')
    }

    await report.delete()

    return report
  }
}
