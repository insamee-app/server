import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Association from 'App/Models/Association'

export default class AssociationSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'name'

    await Association.updateOrCreateMany(uniqueKey, [
      {
        name: 'BDE',
        imageId: 'bca827c0-b3c6-11eb-8529-0242ac130003.png',
        schoolId: 1,
      },
    ])
  }
}
