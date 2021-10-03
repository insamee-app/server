import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { auth } from './messages'

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
        where: {
          deleted_at: null,
        },
      }),
      rules.school(),
    ]),
    password: schema.string({ trim: true }, [rules.confirmed(), rules.isPasswordValid()]),
    receiveEmail: schema.boolean(),
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
    'email.required': auth.email.required,
    'email.string': auth.email.string,
    'email.email': auth.email.email,
    'email.school': auth.email.school,
    'email.unique': auth.email.unique,
    'password.required': auth.password.required,
    'password.string': auth.password.string,
    'password.isPasswordValid': auth.password.isPasswordValid,
    'password_confirmation.confirmed': auth.password.confirmation,
  }
}
