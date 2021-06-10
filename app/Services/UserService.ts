import NotFoundException from 'App/Exceptions/NotFoundException'
import User from 'App/Models/User'

/**
 * Get a user by id
 * @throws {NotFoundException} Will throw an error if a user is not found
 */
export async function getUser(id: number): Promise<User> {
  const user = await User.findOrFail(id)

  if (!user.isVerified) throw new NotFoundException(`Utilisateur ${id} introuvable`)

  return user
}
