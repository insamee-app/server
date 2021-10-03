import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { associationQuery } from './messages'

export default class AssociationQueryValidator {
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
    name: schema.string.optional(),
    thematics: schema.array.optional().members(schema.number()),
    tags: schema.array.optional().members(schema.number()),
    schools: schema.array.optional().members(schema.number()),
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
    'name.string': associationQuery.name,
    'thematics.array': associationQuery.thematics.array,
    'thematics.*.number': associationQuery.thematics.number,
    'tags.array': associationQuery.tags.array,
    'tags.*.number': associationQuery.tags.number,
    'schools.array': associationQuery.schools.array,
    'schools.*.number': associationQuery.schools.number,
  }
}
