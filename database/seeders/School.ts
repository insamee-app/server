import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import School from 'App/Models/School'

export default class SchoolSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'host'

    await School.updateOrCreateMany(uniqueKey, [
      {
        host: 'insa-cvl.fr',
        name: 'INSA Centre Val de Loire',
      },
    ])
  }
}
