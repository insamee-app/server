/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import { ValidationRuntimeOptions, validator } from '@ioc:Adonis/Core/Validator'
import School from 'App/Models/School'

async function validate(
  value: string,
  _,
  { pointer, arrayExpressionPointer, errorReporter }: ValidationRuntimeOptions
) {
  /*
   * value is a valid email using another validator
   */

  /**
   * Skip validation when value is not a string. The string
   * schema rule will handle it
   */
  if (typeof value !== 'string') {
    return
  }

  const schools = await School.all()
  for (const school of schools) {
    const schoolRegExp = new RegExp(`@${school.host}$`, 'i')

    /*
     * Host of value is in the database
     */
    if (schoolRegExp.test(value)) return
  }

  errorReporter.report(pointer, 'school', 'Invalid school', arrayExpressionPointer)
  return
}

function compile() {
  return {
    async: true,
  }
}

validator.rule('school', validate, compile)
