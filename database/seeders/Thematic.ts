import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Thematic from 'App/Models/Thematic'
import { Thematics } from './data'

export default class ThematicSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'name'

    await Thematic.updateOrCreateMany(
      uniqueKey,
      Object.values(Thematics).map((data) => {
        return {
          name: data,
        }
      })
    )
  }
}
