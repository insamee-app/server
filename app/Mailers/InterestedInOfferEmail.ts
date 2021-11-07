import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import Tutorat from 'App/Models/Tutorat'

interface User {
  email: string
  first_name: string
}

export default class InterestedInOfferEmail extends BaseMailer {
  constructor(private tutorat: Tutorat, private user: User) {
    super()
  }
  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  // public mailer = this.mail.use()

  /**
   * The prepare method is invoked automatically when you run
   * "InterestedInOfferEmail.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public prepare(message: MessageContract) {
    const appName = Env.get('APP_NAME')
    const platform = 'Tutorat'

    message
      .from(Env.get('SMTP_USERNAME'), appName)
      .to(this.user.email)
      .subject(`Une offre pourrait vous intéresser ! - ${platform} - ${appName}`)
      .htmlView('emails/interested_in_offer', { tutorat: this.tutorat, user: this.user })
  }
}
