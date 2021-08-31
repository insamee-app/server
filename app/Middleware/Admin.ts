import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'

export default class Admin {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    if (!auth.isAuthenticated)
      throw new UnauthorizedException('Vous devez être authentifié pour accéder à cette ressource')

    if (!auth.user!.isAdmin)
      throw new ForbiddenException(
        "Vous n'avez pas les droits nécessaires pour accéder à cette ressource"
      )

    await next()
  }
}
