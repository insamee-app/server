import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import FocusInterest from 'App/Models/FocusInterest'
import User from 'App/Models/User'

export default class FocusInterestUserSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const user = await User.first()
    const focusInterest = await FocusInterest.first()

    if (focusInterest?.id) {
      await user?.related('focusInterests').sync([focusInterest.id])
    }
  }
}
