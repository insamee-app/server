import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CurrentRole } from 'App/Models/Profile'
import { profile } from './messages'

export default class ProfileValidator {
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
    mobile: schema.string.optional({ trim: true }, [rules.nullableMobile()]),
    /*
     * We prevent user to provide random year
     */
    graduationYear: schema.number.optional([rules.range(1957, this.date.getFullYear() + 5)]),
    urlFacebook: schema.string.optional({ trim: true }, [
      rules.nullableUrl(),
      rules.regex(new RegExp('facebook', 'i')),
    ]),
    urlInstagram: schema.string.optional({ trim: true }, [
      rules.nullableUrl(),
      rules.regex(new RegExp('instagram', 'i')),
    ]),
    urlTwitter: schema.string.optional({ trim: true }, [
      rules.nullableUrl(),
      rules.regex(new RegExp('twitter', 'i')),
    ]),
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
    'lastName.string': profile.lastName.string,
    'lastName.maxLength': profile.lastName.maxLength,
    'firstName.string': profile.firstName.string,
    'firstName.maxLength': profile.firstName.maxLength,
    'currentRole.enum': profile.currentRole.enum,
    'mobile.string': profile.mobile.string,
    'mobile.nullableMobile': profile.mobile.nullableMobile,
    'graduationYear.number': profile.graduationYear.number,
    'graduationYear.range': profile.graduationYear.range,
    'urlFacebook.string': profile.urlFacebook.string,
    'urlFacebook.nullableUrl': profile.urlFacebook.nullableUrl,
    'urlFacebook.regex': profile.urlFacebook.regex,
    'urlInstagram.string': profile.urlInstagram.string,
    'urlInstagram.nullableUrl': profile.urlInstagram.nullableUrl,
    'urlInstagram.regex': profile.urlInstagram.regex,
    'urlTwitter.string': profile.urlTwitter.string,
    'urlTwitter.nullableUrl': profile.urlTwitter.nullableUrl,
    'urlTwitter.regex': profile.urlTwitter.regex,
  }
}
