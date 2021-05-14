import Route from '@ioc:Adonis/Core/Route'
import Env from '@ioc:Adonis/Core/Env'
import { URL, URLSearchParams } from 'url'

/**
 * Create a signed url
 */
export function makeSignedUrl(
  routeIdentifier: string,
  params: { email: string },
  expiresIn: string | undefined = undefined
): string {
  const signedPath = Route.makeSignedUrl(routeIdentifier, { params, expiresIn }) as string
  const signedUrl = new URL(signedPath, Env.get('FRONT_HOST'))

  signedUrl.pathname = '/verifyEmail/' + params.email

  return signedUrl.href
}
