import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Tag from 'App/Models/Tag'
import { Tags } from './data'

export default class TagSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'name'

    await Tag.updateOrCreateMany(
      uniqueKey,
      Object.values(Tags).map((data) => {
        return { name: data }
      })
    )
  }
}
