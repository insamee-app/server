import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Association from 'App/Models/Association'
import Associations from './data/associations'
import Tag from 'App/Models/Tag'

export default class TagAssociationSeeder extends BaseSeeder {
  public async run() {
    for (const association of Associations) {
      const tagsIds = (await Tag.query().whereIn('name', Object.values(association.tags))).map(
        (tag) => tag.id
      )
      const asso = await Association.findByOrFail('name', association.name)

      await asso.related('tags').sync(tagsIds)
    }
  }
}
