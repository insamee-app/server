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
      {
        host: 'insa-lyon.fr',
        name: 'INSA Lyon',
      },
      {
        host: 'insa-strasbourg.fr',
        name: 'INSA Strasbourg',
      },
    ])
  }
}
