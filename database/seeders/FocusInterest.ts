import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import FocusInterest from 'App/Models/FocusInterest'

export default class FocusInterestSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'name'

    await FocusInterest.updateOrCreateMany(uniqueKey, [
      {
        name: 'football',
      },
    ])
  }
}
