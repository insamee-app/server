import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { tutoratQuery } from './messages'
import { CurrentRole } from 'App/Models/Profile'
import { TutoratType, TutoratSiting } from 'App/Models/Tutorat'

export default class TutoratQueryValidator {
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
    currentRole: schema.enum.optional(Object.values(CurrentRole)),
    type: schema.enum.optional(Object.values(TutoratType)),
    siting: schema.enum.optional(Object.values(TutoratSiting)),
    subjects: schema.array.optional().members(schema.number()),
    schools: schema.array.optional().members(schema.number()),
    time: schema.number.optional(),
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
    'currentRole.enum': tutoratQuery.currentRole.enum,
    'type.enum': tutoratQuery.type.enum,
    'subjects.*.array': tutoratQuery.subjects.array,
    'subject.number': tutoratQuery.subjects.number,
    'schools.*.array': tutoratQuery.schools.array,
    'schools.number': tutoratQuery.schools.number,
    'time.number': tutoratQuery.time.number,
  }
}
