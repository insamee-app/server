import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

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
  public schema = schema.create({
    lastName: schema.string.optional({ trim: true }),
    firstName: schema.string.optional({ trim: true }),
    text: schema.string.optional({ trim: true }),
    mobile: schema.string.optional({ trim: true }, [rules.mobile({ locales: ['fr-FR'] })]),
    skills: schema.array.optional().members(schema.string({ trim: true })),
    focusInterest: schema.array.optional().members(schema.string({ trim: true })),
    /*
     * We prevent user to provide random year
     */
    graduationYear: schema.number.optional([rules.range(1957, this.date.getFullYear() + 5)]),
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
    'graduationYear.range': "Cette année de diplomation n'est pas acceptée",
    'mobile.mobile': "Ce numéro de téléphone n'est pas valide",
    'skills.array': "Le type n'est pas le bon",
    'skills.*.string': 'Les données doivent être des chaînes de caractères',
    'focusInterest.array': "Le type n'est pas le bon",
    'focusInterest.*.string': 'Les données doivent être des chaînes de caractères',
  }
}
