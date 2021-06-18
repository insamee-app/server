import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Association from 'App/Models/Association'
import { CurrentRole } from 'App/Models/Profile'
import Skill from 'App/Models/Skill'
import FocusInterest from 'App/Models/FocusInterest'
import { insameeProfile } from './messages'

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public date = new Date()
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
    lastName: schema.string.optional({ trim: true }, [rules.maxLength(30)]),
    firstName: schema.string.optional({ trim: true }, [rules.maxLength(30)]),
    currentRole: schema.enum.optional(Object.values(CurrentRole)),
    text: schema.string.optional({ trim: true }, [rules.maxLength(2048)]),
    mobile: schema.string.optional({ trim: true }, [rules.nullableMobile()]),
    skills: schema.array
      .optional()
      .members(schema.number([rules.exists({ table: Skill.table, column: 'id' })])),
    focusInterests: schema.array
      .optional()
      .members(schema.number([rules.exists({ table: FocusInterest.table, column: 'id' })])),
    associations: schema.array
      .optional()
      .members(schema.number([rules.exists({ table: Association.table, column: 'id' })])),
    /*
     * We prevent user to provide random year
     */
    graduationYear: schema.number.optional([rules.range(1957, this.date.getFullYear() + 5)]),
    urlFacebook: schema.string.optional({ trim: true }, [rules.nullableUrl()]),
    urlInstagram: schema.string.optional({ trim: true }, [rules.nullableUrl()]),
    urlTwitter: schema.string.optional({ trim: true }, [rules.nullableUrl()]),
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
    'lastName.string': insameeProfile.lastName.string,
    'lastName.maxLength': insameeProfile.lastName.maxLength,
    'firstName.string': insameeProfile.firstName.string,
    'firstName.maxLength': insameeProfile,
    'currentRole.enum': insameeProfile.currentRole.enum,
    'text.string': insameeProfile.text.string,
    'text.maxLength': insameeProfile.text.maxLength,
    'mobile.string': insameeProfile.mobile.string,
    'mobile.nullableMobile': insameeProfile.mobile.nullableMobile,
    'skills.array': insameeProfile.skills.array,
    'skills.*.number': insameeProfile.skills.number,
    'skills.*.exists': insameeProfile.skills.exists,
    'focusInterests.array': insameeProfile.focusInterests.array,
    'focusInterests.*.number': insameeProfile.focusInterests.number,
    'focusInterests.*.exists': insameeProfile.focusInterests.exists,
    'associations.array': insameeProfile.associations.array,
    'associations.*.number': insameeProfile.associations.number,
    'associations.*.exists': insameeProfile.associations.exists,
    'graduationYear.number': insameeProfile.graduationYear.number,
    'graduationYear.range': insameeProfile.graduationYear.range,
    'urlFacebook.string': insameeProfile.urlFacebook.string,
    'urlFacebook.nullableUrl': insameeProfile.urlFacebook.nullableUrl,
    'urlInstagram.string': insameeProfile.urlInstagram.string,
    'urlInstagram.nullableUrl': insameeProfile.urlInstagram.nullableUrl,
    'urlTwitter.string': insameeProfile.urlTwitter.string,
    'urlTwitter.nullableUrl': insameeProfile.urlTwitter.nullableUrl,
  }
}
