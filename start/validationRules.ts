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
import isUrl from 'validator/lib/isUrl'
import isMobilePhone from 'validator/lib/isMobilePhone'
import School from 'App/Models/School'
import User from 'App/Models/User'

async function validateSchool(
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

function compileSchool() {
  return {
    async: true,
  }
}

validator.rule('school', validateSchool, compileSchool)

async function validateIsUserVerified(
  value: string,
  [{ verified }],
  { pointer, arrayExpressionPointer, errorReporter }: ValidationRuntimeOptions
) {
  /**
   * value is a valid email using another validator
   */

  /**
   * Skip validation when value is not a string. The string
   * schema rule will handle it
   */
  if (typeof value !== 'string') {
    return
  }

  /**
   * User is in database because of a check in exists rule
   */
  const user = await User.findBy('email', value)

  if (verified && user?.isVerified) return
  if (!verified && !user?.isVerified) return

  errorReporter.report(pointer, 'isUserVerified', 'Invalid user', arrayExpressionPointer)
  return
}

function compileIsUserVerified() {
  return {
    async: true,
  }
}

validator.rule('isUserVerified', validateIsUserVerified, compileIsUserVerified)

async function validateIsPasswordValid(
  value: string,
  _,
  { pointer, arrayExpressionPointer, errorReporter }: ValidationRuntimeOptions
) {
  /**
   * value is a valid email using another validator
   */

  /**
   * Skip validation when value is not a string. The string
   * schema rule will handle it
   */
  if (typeof value !== 'string') {
    return
  }

  const passwordRegExp = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 'g')
  if (passwordRegExp.test(value)) return

  errorReporter.report(pointer, 'isPasswordValid', 'Invalid password', arrayExpressionPointer)
  return
}

function compileIsPasswordValid() {
  return {
    async: true,
  }
}

validator.rule('isPasswordValid', validateIsPasswordValid, compileIsPasswordValid)

async function validateNullableUrl(
  value: string,
  _,
  { pointer, arrayExpressionPointer, errorReporter }: ValidationRuntimeOptions
) {
  /**
   * Ignore non-string values. The user must apply string rule
   * to validate string.
   */
  if (typeof value !== 'string') {
    return
  }

  /**
   * Allow value to be empty
   */
  if (value.length === 0) {
    return
  }

  /**
   * Invalid url
   */
  if (!isUrl(value)) {
    errorReporter.report(
      pointer,
      'nullableUrl',
      "Cette url n'est pas valide",
      arrayExpressionPointer
    )
    return
  }
}

validator.rule('nullableUrl', validateNullableUrl)

async function validateNullableMobile(
  value: string,
  { pointer, arrayExpressionPointer, errorReporter }: ValidationRuntimeOptions
) {
  /**
   * Ignore non-string values. The user must apply string rule
   * to validate string.
   */
  if (typeof value !== 'string') {
    return
  }

  /**
   * Allow value to be empty
   */
  if (value.length === 0) {
    return
  }

  /**
   * Invalid mobile
   */
  if (!isMobilePhone(value, 'fr-FR')) {
    errorReporter.report(
      pointer,
      'nullableMobile',
      "Ce numéro n'est pas valide",
      arrayExpressionPointer
    )
    return
  }
}

validator.rule('nullableMobile', validateNullableMobile)
