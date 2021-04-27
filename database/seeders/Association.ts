import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Association from 'App/Models/Association'

export default class AssociationSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'name'

    await Association.updateOrCreateMany(uniqueKey, [
      {
        name: 'BDE',
        schoolId: 1,
      },
    ])
  }
}
