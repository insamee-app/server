import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Thematic from 'App/Models/Thematic'

export default class ThematicSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'name'

    await Thematic.updateOrCreateMany(uniqueKey, [
      {
        name: 'culturel',
      },
      {
        name: 'solidarités',
      },
      {
        name: 'sport',
      },
      {
        name: 'technique',
      },
      {
        name: 'gala',
      },
    ])
  }
}
