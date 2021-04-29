import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { currentRole } from 'App/Models/User'

export default class QueryUsersValidator {
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
    limit: schema.number.optional(),
    page: schema.number.optional(),
    currentRole: schema.enum.optional(Object.values(currentRole)),
    skill: schema.string.optional({ trim: true }),
    focusInterest: schema.string.optional({ trim: true }),
    association: schema.string.optional({ trim: true }),
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
    'page.number': 'La page souhaitée doit être un nombre',
    'limit.number': 'La limite souhaitée doit être un nombre',
    'currentRole.enum': "La valeur n'est pas la bonne",
    'skill.string': 'La valeur doit être une chaîne de caractère',
    'focusInterest.string': 'La valeur doit être une chaîne de caractère',
    'association.string': 'La valeur doit être une chaîne de caractère',
  }
}
