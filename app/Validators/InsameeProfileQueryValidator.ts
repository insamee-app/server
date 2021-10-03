import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CurrentRole } from 'App/Models/Profile'
import { insameeProfileQuery } from './messages'

export default class InsameeProfileQueryValidator {
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
    // text: schema.string.optional({ trim: true }),
    currentRole: schema.enum.optional(Object.values(CurrentRole)),
    skills: schema.array.optional().members(schema.number()),
    focusInterests: schema.array.optional().members(schema.number()),
    associations: schema.array.optional().members(schema.number()),
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
    'currentRole.enum': insameeProfileQuery.currentRole.enum,
    'skills.*.number': insameeProfileQuery.skills.number,
    'skills.array': insameeProfileQuery.skills.array,
    'focusInterests.*.number': insameeProfileQuery.focusInterests.number,
    'focusInterests.array': insameeProfileQuery.focusInterests.array,
    'associations.*.number': insameeProfileQuery.associations.number,
    'associations.array': insameeProfileQuery.associations.array,
  }
}
