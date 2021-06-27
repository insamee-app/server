import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Association from 'App/Models/Association'
import Tag from 'App/Models/Tag'

export default class TagAssociationSeeder extends BaseSeeder {
  public async run() {
    const associations = await Association.all()
    const tags = await Tag.all()

    for (const [index, association] of associations.entries()) {
      const value = index + 3
      if (value >= tags.length) break

      const ids = [tags[value].id, tags[value - 1].id, tags[value - 2].id]
      await association.related('tags').sync([...ids])
    }
  }
}
