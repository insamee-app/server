import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import FocusInterest from 'App/Models/FocusInterest'
import ProfileInsamee from 'App/Models/InsameeProfile'

export default class FocusInterestInsameeProfileSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const profiles = await ProfileInsamee.withTrashed().exec()
    const focusInterests = await FocusInterest.all()

    for (const [index, profile] of profiles.entries()) {
      const value = index + 3
      if (value >= focusInterests.length) break

      const ids = [
        focusInterests[value].id,
        focusInterests[value - 1].id,
        focusInterests[value - 2].id,
      ]
      await profile.related('focusInterests').sync([...ids])
    }
  }
}
