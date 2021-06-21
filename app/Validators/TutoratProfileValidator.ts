import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { tutoratProfile } from './messages'
import Subject from 'App/Models/Subject'

export default class TutoratProfileValidator {
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
    preferredSubjects: schema.array
      .optional()
      .members(schema.number([rules.exists({ table: Subject.table, column: 'id' })])),
    difficultiesSubjects: schema.array
      .optional()
      .members(schema.number([rules.exists({ table: Subject.table, column: 'id' })])),
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
    'text.string': tutoratProfile.text.string,
    'text.maxLength': tutoratProfile.text.maxLength,
    'preferredSubjects.array': tutoratProfile.preferredSubjects.array,
    'preferredSubjects.*.number': tutoratProfile.preferredSubjects.number,
    'preferredSubjects.*.exists': tutoratProfile.preferredSubjects.exists,
    'difficultiesSubjects.array': tutoratProfile.difficultiesSubjects.array,
    'difficultiesSubjects.*.number': tutoratProfile.difficultiesSubjects.number,
    'difficultiesSubjects.*.exists': tutoratProfile.difficultiesSubjects.exists,
  }
}
