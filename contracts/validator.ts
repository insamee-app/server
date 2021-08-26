declare module '@ioc:Adonis/Core/Validator' {
  import { Rule } from '@ioc:Adonis/Core/Validator'
  import validator from 'validator'

  export interface Rules {
    school(): Rule
    isUserVerified(options: { verified: boolean }): Rule
    isPasswordValid(): Rule
    nullableUrl(): Rule
    nullableMobile(): Rule
    nullableEmail(): Rule
  }
}
