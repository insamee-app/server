import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import AssociationsReport from 'App/Models/AssociationsReport'
import ProfilesReport from 'App/Models/ProfilesReport'
import TutoratsReport from 'App/Models/TutoratsReport'
import ReportValidator from 'App/Validators/ReportValidator'
import { ModelObject, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import NotFoundException from 'App/Exceptions/NotFoundException'
import PaginateQueryValidator from 'App/Validators/PaginateQueryValidator'

export enum Resource {
  PROFILES = 'profiles',
  TUTORATS = 'tutorats',
  ASSOCIATIONS = 'associations',
}

export default class ReportsController {
  private LIMITE = 20

  public async index({ params, request, bouncer }: HttpContextContract) {
    try {
      await bouncer.with('ReportPolicy').authorize('view')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { resource } = params as { resource: Resource }
    const { page } = await request.validate(PaginateQueryValidator)
    const { withTrashed, orderBy, sortBy } = await request.validate(ReportValidator)

    let reportsQuery: ModelQueryBuilderContract<
      typeof ProfilesReport | typeof TutoratsReport | typeof AssociationsReport,
      ProfilesReport | TutoratsReport | AssociationsReport
    >
    switch (resource) {
      case Resource.PROFILES:
        reportsQuery = ProfilesReport.query()
          .preload('profileUser', (query) => query.withTrashed())
          .preload('user', (query) => query.withTrashed())
          .preload('reason')
        break
      case Resource.TUTORATS:
        reportsQuery = TutoratsReport.query()
          .preload('tutorat', (query) => query.preload('user'))
          .preload('user', (query) => query.withTrashed())
          .preload('reason')
        break
      case Resource.ASSOCIATIONS:
        reportsQuery = AssociationsReport.query()
          .preload('association', (query) => query.withTrashed())
          .preload('user', (query) => query.withTrashed())
          .preload('reason')
        break
      default:
        throw new Error(`Resource ${resource} not found`)
    }

    reportsQuery
      .if(withTrashed, (query) => {
        query.withTrashed()
      })
      .if(sortBy, (query) => {
        query.orderBy(sortBy!, (orderBy as 'asc' | 'desc')!)
      })
    const reports = await reportsQuery.paginate(page, this.LIMITE)

    let serializedReports: {
      meta: any
      data: ModelObject[]
    }
    switch (resource) {
      case Resource.PROFILES:
        serializedReports = reports.serialize({
          fields: ['id', 'description', 'created_at', 'deleted_at'],
          relations: {
            profile_user: {
              fields: ['id', 'email'],
            },
            user: {
              fields: ['email'],
            },
            reason: {
              fields: ['name'],
            },
          },
        })
        break
      case Resource.TUTORATS:
        serializedReports = reports.serialize({
          fields: ['id', 'description', 'created_at', 'deleted_at'],
          relations: {
            tutorat: {
              fields: ['id'],
              relations: {
                user: {
                  fields: ['email'],
                },
              },
            },
            user: {
              fields: ['email'],
            },
            reason: {
              fields: ['name'],
            },
          },
        })
        break
      case Resource.ASSOCIATIONS:
        serializedReports = reports.serialize({
          fields: ['id', 'description', 'created_at', 'deleted_at'],
          relations: {
            association: {
              fields: ['id', 'name'],
            },
            user: {
              fields: ['email'],
            },
            reason: {
              fields: ['name'],
            },
          },
        })
        break
      default:
        throw new Error(`Resource ${resource} not found`)
    }

    return serializedReports
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

  public async destroy({ params, bouncer }: HttpContextContract) {
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
