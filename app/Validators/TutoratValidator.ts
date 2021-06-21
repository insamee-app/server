import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Subject from 'App/Models/Subject'
import { tutorat } from './messages'
import { TutoratType } from 'App/Models/Tutorat'
import School from 'App/Models/School'

export default class TutoratValidator {
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
    subject: schema.number([rules.exists({ table: Subject.table, column: 'id' })]),
    school: schema.number([rules.exists({ table: School.table, column: 'id' })]),
    text: schema.string.optional({ trim: true }, [rules.maxLength(2048)]),
    time: schema.number.optional([
      rules.requiredWhen('type', '=', TutoratType.OFFER),
      rules.range(30, 180),
    ]),
    type: schema.enum.optional(Object.values(TutoratType)),
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
    'text.string': tutorat.text.string,
    'text.maxLength': tutorat.text.maxLength,
    'subject.array': tutorat.subject.array,
    'subject.*.number': tutorat.subject.number,
    'subject.*.exists': tutorat.subject.exists,
    'school.number': tutorat.school.number,
    'school.exists': tutorat.school.exists,
    'time.number': tutorat.time.number,
    'time.range': tutorat.time.range,
    'type.enum': tutorat.type.enum,
  }
}
