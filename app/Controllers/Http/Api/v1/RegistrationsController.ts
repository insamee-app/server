import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegistrationsController {
  public async show({ params, auth }: HttpContextContract) {
    const { id } = params
    const { user } = auth
    const {platform} = await request.validate()

    if (platform === Pla
    const registration = await Database.from('registration_tutorat')
      .where('user_id', user!.id)
      .where('tutorat_id', '=', id)
      .firstOrFail()

    return registration
  }
}
