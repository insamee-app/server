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
| new ForbiddenException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class ForbiddenException extends Exception {
  constructor(message: string) {
    super(message, 403)
  }

  public async handle(error: this) {
    return {
      status: error.status,
      message: error.message,
    }
  }
}
