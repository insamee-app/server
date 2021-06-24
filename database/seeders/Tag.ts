import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Tag from 'App/Models/Tag'

export default class TagSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'name'

    await Tag.updateOrCreateMany(uniqueKey, [
      {
        name: 'musique',
      },
      {
        name: 'sport',
      },
      {
        name: 'théatre',
      },
      {
        name: 'robotique',
      },
      {
        name: 'mécanique',
      },
      {
        name: 'jardinage',
      },
      {
        name: 'cuisine',
      },
    ])
  }
}
