import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import NotFoundException from 'App/Exceptions/NotFoundException'
import RegistrationQueryValidator from 'App/Validators/RegistrationQueryValidator'
import { Platform } from './ReasonsController'

export default class RegistrationsController {
  public async show({ params, auth, request }: HttpContextContract) {
    const { id } = params
    const { user } = auth
    const { platform } = await request.validate(RegistrationQueryValidator)

    if (platform === Platform.TUTORAT) {
      try {
        await Database.from('registration_tutorat')
          .where('user_id', user!.id)
          .where('tutorat_id', '=', id)
          .firstOrFail()
      } catch (e) {
        throw new NotFoundException('Inscription non trouvée')
      }

      return {
        registered: 'ok',
      }
    } else return {}
  }
}
