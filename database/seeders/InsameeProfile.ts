import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Profile from 'App/Models/Profile'

export default class InsameeProfileSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const rawProfiles = [
      {
        text: "Hello, I'm just a seed",
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
        text: "Hello, I'm just another seed",
      },
      {
        text: "Hello, I'm just another seed",
      },
      {
        text: "Hello, I'm just another seed",
      },
      {
        text: "Hello, I'm just another seed",
      },
      {
        text: "Hello, I'm just another seed",
      },
    ]

    const profiles = await Profile.all()

    for (const [index, profile] of profiles.entries()) {
      await profile
        .related('insameeProfile')
        .updateOrCreate(
          { userId: profile.userId },
          { ...rawProfiles[index], userId: profile.userId }
        )
    }
  }
}
