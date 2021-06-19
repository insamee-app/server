import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Association from 'App/Models/Association'
import Skill from 'App/Models/Skill'
import FocusInterest from 'App/Models/FocusInterest'
import { insameeProfile } from './messages'

export default class InsameeProfileValidator {
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
    text: schema.string.optional({ trim: true }, [rules.maxLength(2048)]),
    skills: schema.array
      .optional()
      .members(schema.number([rules.exists({ table: Skill.table, column: 'id' })])),
    focusInterests: schema.array
      .optional()
      .members(schema.number([rules.exists({ table: FocusInterest.table, column: 'id' })])),
    associations: schema.array
      .optional()
      .members(schema.number([rules.exists({ table: Association.table, column: 'id' })])),
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
    'text.string': insameeProfile.text.string,
    'text.maxLength': insameeProfile.text.maxLength,
    'skills.array': insameeProfile.skills.array,
    'skills.*.number': insameeProfile.skills.number,
    'skills.*.exists': insameeProfile.skills.exists,
    'focusInterests.array': insameeProfile.focusInterests.array,
    'focusInterests.*.number': insameeProfile.focusInterests.number,
    'focusInterests.*.exists': insameeProfile.focusInterests.exists,
    'associations.array': insameeProfile.associations.array,
    'associations.*.number': insameeProfile.associations.number,
    'associations.*.exists': insameeProfile.associations.exists,
  }
}
