import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { associationsQuery } from './messages'

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
    page: schema.number.optional(),
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
    'page.number': associationsQuery.page.number,
    'name.string': associationsQuery.name,
    'thematics.array': associationsQuery.thematics.array,
    'thematics.*.number': associationsQuery.thematics.number,
    'tags.array': associationsQuery.tags.array,
    'tags.*.number': associationsQuery.tags.number,
    'schools.array': associationsQuery.schools.array,
    'schools.*.number': associationsQuery.schools.number,
  }
}
