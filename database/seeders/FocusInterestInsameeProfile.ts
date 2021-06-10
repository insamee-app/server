import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import FocusInterest from 'App/Models/FocusInterest'
import ProfileInsamee from 'App/Models/InsameeProfile'

export default class FocusInterestInsameeProfileSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const profile = await ProfileInsamee.first()
    const focusInterest = await FocusInterest.first()

    if (focusInterest?.id) {
      await profile?.related('focusInterests').sync([focusInterest.id])
    }
  }
}
