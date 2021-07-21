import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AssociationsReason from 'App/Models/AssociationsReason'

export default class AssociationsReasonSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'name'

    await AssociationsReason.updateOrCreateMany(uniqueKey, [
      {
        name: "Erreur dans l'adresse de contact de l'association",
      },
      {
        name: "Erreur dans la description de l'association",
      },
      {
        name: "Une personne qui se dit membre n'est pas membre",
      },
      {
        name: "Erreur dans la photo de l'association",
      },
      {
        name: "L'association n'existe plus",
      },
      {
        name: "L'association a changé",
      },
    ])
  }
}
