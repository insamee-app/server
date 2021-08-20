import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForbiddenException from 'App/Exceptions/ForbiddenException'

export default class Blocked {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    const { user } = auth

    if (user!.isBlocked) {
      throw new ForbiddenException('Votre compte a été suspendu')
    }

    await next()
  }
}
