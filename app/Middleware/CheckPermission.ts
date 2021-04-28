import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForbiddenException from 'App/Exceptions/ForbiddenException'

export default class CheckPermission {
  public async handle({ params, auth }: HttpContextContract, next: () => Promise<void>) {
    const id = params.id
    const user = auth.user!

    /*
     * A user can't access to ressource is the id of the wanted content is not his own id
     */
    if (user.id != id) throw new ForbiddenException("You're not allowed to access to this resource")

    await next()
  }
}
