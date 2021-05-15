import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import { makeSignedUrl } from 'App/Services/MailerService'
import Env from '@ioc:Adonis/Core/Env'

export default class ResetPassword extends BaseMailer {
  constructor(private email: string) {
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
   * "ResetPassword.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public prepare(message: MessageContract) {
    const signedUrl = makeSignedUrl('resetPassword', 'resetPassword', { email: this.email }, '10m')

    const appName = Env.get('APP_NAME').toUpperCase()

    message
      .from(Env.get('SMTP_USERNAME'), appName)
      .to(this.email)
      .subject(`Réinitialisation du mot de passe - ${appName}`)
      .htmlView('emails/reset_password', { url: signedUrl })
  }
}
