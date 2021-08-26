import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import ReportValidator from 'App/Validators/ReportValidator'
import { ModelObject } from '@ioc:Adonis/Lucid/Orm'
import PaginateQueryValidator from 'App/Validators/PaginateQueryValidator'
import { getReport, load, preload, query, Resource } from 'App/Services/ReportService'

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

    const reportsQuery = query(resource)
    preload(reportsQuery, resource)

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

    const reportsQuery = query(resource)
    const report = await getReport(reportsQuery, id)
    await load(report, resource)

    return report
  }

  public async destroy({ params, bouncer }: HttpContextContract) {
    try {
      await bouncer.with('ReportPolicy').authorize('destroy')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { resource, id } = params as { resource: Resource; id: number }

    const reportsQuery = query(resource)
    const report = await getReport(reportsQuery, id)
    await load(report, resource)

    await report.delete()

    return report
  }
}
