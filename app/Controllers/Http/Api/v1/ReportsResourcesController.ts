import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import NotFoundException from 'App/Exceptions/NotFoundException'
import { Resource } from 'App/Services/ReportService'

export default class ReportsResourcesController {
  public async show({ params, auth }: HttpContextContract) {
    const { user } = auth
    const { id, resource } = params as { id: number; resource: Resource }

    try {
      await Database.from(`${resource}_reports`)
        .where('user_id', user!.id)
        .andWhere(`${resource.slice(0, -1)}_id`, id) // remove 's' from resource
        .andWhereNull('deleted_at') // only active reports
        .firstOrFail()
      return {
        reported: 'ok',
        already: true,
      }
    } catch (error) {
      throw new NotFoundException("Cette ressource n'existe pas")
    }
  }
}
