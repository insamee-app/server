import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { auth } from './messages'

export default class LoginValidator {
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
      rules.exists({
        table: User.table,
        column: 'email',
        where: {
          deleted_at: null,
        },
      }),
      rules.isUserVerified({ verified: true }),
    ]),
    password: schema.string({ trim: true }),
    rememberMe: schema.boolean.optional(),
  })

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
    'email.isUserVerified': auth.email.isUserVerified.verified,
    'email.exists': auth.email.exists,
    'password.required': auth.password.required,
    'password.string': auth.password.string,
    'rememberMe.boolean': auth.rememberMe.boolean,
  }
}
