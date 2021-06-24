import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Profile from 'App/Models/Profile'
import { texts } from './utils'

export default class TutoratProfileSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const profiles = await Profile.all()

    for (const [index, profile] of profiles.entries()) {
      const value = index % texts.length
      await profile
        .related('tutoratProfile')
        .updateOrCreate({ userId: profile.userId }, { text: texts[value], userId: profile.userId })
    }
  }
}
