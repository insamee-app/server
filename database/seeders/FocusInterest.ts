import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import FocusInterest from 'App/Models/FocusInterest'

export default class FocusInterestSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'name'

    await FocusInterest.updateOrCreateMany(uniqueKey, [
      {
        name: 'lire',
      },
      {
        name: 'peindre',
      },
      {
        name: 'sculpter',
      },
      {
        name: 'écrire des nouvelles',
      },
      {
        name: 'visiter des musées',
      },
      {
        name: 'écouter de la musique',
      },
      {
        name: 'regarder des films',
      },
      {
        name: 'suivre un artiste',
      },
      {
        name: 'se passionner pour un courant artistique',
      },
      {
        name: 'le scrapbooking',
      },
      {
        name: 'la musique',
      },
      {
        name: 'la dance',
      },
      {
        name: 'le théatre',
      },
      {
        name: 'la photographie',
      },
      {
        name: 'la cuisine',
      },
      {
        name: 'la peinture',
      },
      {
        name: 'la sculpture',
      },
      {
        name: 'la poterie',
      },
      {
        name: "l'écriture",
      },
      {
        name: 'la couture',
      },
    ])
  }
}
