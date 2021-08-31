import NotFoundException from 'App/Exceptions/NotFoundException'
import Thematic from 'App/Models/Thematic'

export async function getThematic(id: number): Promise<Thematic> {
  let thematic: Thematic
  try {
    thematic = await Thematic.withTrashed().where('id', id).firstOrFail()
  } catch (error) {
    throw new NotFoundException('Thématique introuvable')
  }

  return thematic
}
