import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Association from 'App/Models/Association'
import Skill from 'App/Models/Skill'
import FocusInterest from 'App/Models/FocusInterest'
import { meeProfile } from './messages'

export default class MeeProfileValidator {
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
    'text.string': meeProfile.text.string,
    'text.maxLength': meeProfile.text.maxLength,
    'skills.array': meeProfile.skills.array,
    'skills.*.number': meeProfile.skills.number,
    'skills.*.exists': meeProfile.skills.exists,
    'focusInterests.array': meeProfile.focusInterests.array,
    'focusInterests.*.number': meeProfile.focusInterests.number,
    'focusInterests.*.exists': meeProfile.focusInterests.exists,
    'associations.array': meeProfile.associations.array,
    'associations.*.number': meeProfile.associations.number,
    'associations.*.exists': meeProfile.associations.exists,
  }
}
