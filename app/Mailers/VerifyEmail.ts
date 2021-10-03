import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import { makeSignedUrl } from 'App/Services/MailerService'

export default class VerifyEmail extends BaseMailer {
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
   * "VerifyEmail.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public prepare(message: MessageContract) {
    const signedUrl = makeSignedUrl('verify-email', 'verifyEmail', { email: this.email }, '10m')

    const appName = 'InsameeApp'

    message
      .from(Env.get('SMTP_USERNAME'), appName)
      .to(this.email)
      .subject(`Vérification du compte - ${appName}`)
      .htmlView('emails/verify_email', { url: signedUrl })
  }
}
