import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import TutoratsReason from 'App/Models/TutoratsReason'

export default class TutoratsReasonSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'name'

    await TutoratsReason.updateOrCreateMany(uniqueKey, [
      {
        name: 'Tutorat sans intérêt',
      },
      {
        name: 'Tutorat avec trop de fautes',
      },
      {
        name: 'Tutorat mal formulé',
      },
      {
        name: 'Tutorat faux',
      },
      {
        name: 'Contenu haineux',
      },
      {
        name: 'Les tutorats de cette personne sont médiocre',
      },
      {
        name: "La personne qui fait le tutorat n'est pas là",
      },
    ])
  }
}
