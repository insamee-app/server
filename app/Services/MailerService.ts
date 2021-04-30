import Route from '@ioc:Adonis/Core/Route'
import Env from '@ioc:Adonis/Core/Env'

/**
 * Create a signed url
 */
export function makeSignedUrl(
  routeIdentifier: string,
  params: object,
  expiresIn: string | undefined = undefined
): string {
  const signedPath = Route.makeSignedUrl(routeIdentifier, { params, expiresIn })

  const signedUrl = `https://${Env.get('FRONT_HOST')}${signedPath}`

  return signedUrl
}
