import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ProfilesReason from 'App/Models/ProfilesReason'

export default class ProfilesReasonSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'name'

    await ProfilesReason.updateOrCreateMany(uniqueKey, [
      {
        name: 'Profil faux',
      },
      {
        name: 'Profil haineux',
      },
      {
        name: 'Photo de profil incorrect',
      },
      {
        name: 'Description sans pertinence',
      },
      {
        name: "Usurpation d'identité",
      },
      {
        name: 'Liens de contact incorrect',
      },
      {
        name: 'Une association est incorrect',
      },
    ])
  }
}
