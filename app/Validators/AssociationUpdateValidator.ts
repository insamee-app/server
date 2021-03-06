import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { association } from './messages'

export default class AssociationUpdateValidator {
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
  public existsStrict = true

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.maxLength(255)]),
    text: schema.string.optional({ trim: true }, [rules.maxLength(2048)]),
    email: schema.string.optional({ trim: true }, [rules.nullableEmail()]),
    thematicId: schema.number.optional([rules.exists({ table: 'thematics', column: 'id' })]),
    tags: schema.array
      .optional()
      .members(schema.number([rules.exists({ table: 'tags', column: 'id' })])),
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
    'name.required': association.name.required,
    'name.maxLength': association.name.maxLength,
    'text.maxLength': association.text.maxLength,
    'email.nullableEmail': association.email.email,
    'thematicId.number': association.thematic.number,
    'thematicId.exists': association.thematic.exists,
    'tags.array': association.tags.array,
    'tags.*.number': association.tags.number,
    'tags.*.exists': association.tags.exists,
  }
}
