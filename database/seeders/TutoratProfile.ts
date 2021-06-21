import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Profile from 'App/Models/Profile'

export default class TutoratProfileSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const rawProfiles = [
      {
        text: "Hello, I'm just a seed from the tutorat profile",
      },
      {
        text: undefined,
      },
      {
        text: undefined,
      },
      {
        text: undefined,
      },
      {
        text: undefined,
      },
      {
        text: "Hello, I'm just another seed from the tutorat profile",
      },
      {
        text: "Hello, I'm just another seed from the tutorat profile",
      },
      {
        text: "Hello, I'm just another seed from the tutorat profile",
      },
      {
        text: "Hello, I'm just another seed from the tutorat profile",
      },
      {
        text: "Hello, I'm just another seed from the tutorat profile",
      },
    ]

    const profiles = await Profile.all()

    for (const [index, profile] of profiles.entries()) {
      await profile
        .related('tutoratProfile')
        .updateOrCreate(
          { userId: profile.userId },
          { ...rawProfiles[index], userId: profile.userId }
        )
    }
  }
}
