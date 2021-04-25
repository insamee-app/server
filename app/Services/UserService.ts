import NotFoundException from 'App/Exceptions/NotFoundException'
import User from 'App/Models/User'

export async function getUser(id: number): Promise<User> {
  const user = await User.find(id)

  if (!user) throw new NotFoundException(`Utilisateur ${id} introuvable`)

  return user
}
