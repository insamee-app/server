import NotFoundException from 'App/Exceptions/NotFoundException'
import User from 'App/Models/User'

/**
 * Get a user by id
 * @throws {NotFoundException} Will throw an error if a user is not found
 */
export async function getUser(id: number, isAdmin: boolean = false): Promise<User> {
  let user: User
  try {
    const userQuery = User.query().where('id', id)
    // Admins can get trashed users
    if (isAdmin) userQuery.withTrashed()
    // Non-admins can only get a verified user
    else userQuery.where('isVerified', true)

    user = await userQuery.firstOrFail()
  } catch (error) {
    throw new NotFoundException('Utilisateur introuvable')
  }

  return user
}
