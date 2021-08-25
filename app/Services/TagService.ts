import NotFoundException from 'App/Exceptions/NotFoundException'
import Tag from 'App/Models/Tag'

export async function getTag(id: number): Promise<Tag> {
  let tag: Tag
  try {
    tag = await Tag.withTrashed().where('id', id).firstOrFail()
  } catch (error) {
    throw new NotFoundException('Thématique introuvable')
  }

  return tag
}
