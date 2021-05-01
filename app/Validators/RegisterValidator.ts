import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email({ sanitize: true }),
      rules.unique({
        table: User.table,
        column: 'email',
      }),
      rules.school(),
    ]),
    password: schema.string({ trim: true }, [rules.confirmed(), rules.isPasswordValid()]),
  })

  public cacheKey = this.ctx.routeKey

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {
    'email.required': 'Une adresse électronique est nécessaire',
    'password.required': 'Un mot de passe est nécessaire',
    'password_confirmation.confirmed': 'Le mot de passe de validation est incorrect',
    'password.isPasswordValid': "Ce mot de passe n'est pas valide",
    'school': "La plateforme n'est pas disponible pour votre école",
  }
}
