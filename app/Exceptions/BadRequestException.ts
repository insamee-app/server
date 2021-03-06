import { Exception } from '@poppinss/utils'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new BadRequestException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class BadRequestException extends Exception {
  constructor(message: string) {
    super(message, 400)
  }

  public async handle(error: this) {
    return {
      statusCode: error.status,
      message: error.message,
    }
  }
}
