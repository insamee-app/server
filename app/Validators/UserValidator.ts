import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Association from 'App/Models/Association'
import { CurrentRole } from 'App/Models/User'
import Skill from 'App/Models/Skill'
import FocusInterest from 'App/Models/FocusInterest'

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
    // Not able to remove data from the database
    avatar: schema.file.optional({
      size: '60kb',
      extnames: ['jpg', 'png', 'jpeg'],
    }),
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
    'currentRole.enum': "Cette valeur n'est pas acceptée",
    'graduationYear.range': "Cette année de diplomation n'est pas acceptée",
    'mobile.mobile': "Ce numéro de téléphone n'est pas valide",
    'associations.array': "Le type n'est pas le bon",
    'file.size': 'Ce fichier est trop volumineux',
    'associations.*.number': 'Les données doivent être des nombres',
    'skills.array': "Le type n'est pas le bon",
    'skills.*.number': 'Les données doivent être des nombres',
    'focusInterests.array': "Le type n'est pas le bon",
    'focusInterests.*.number': 'Les données doivent être des nombres',
  }
}
