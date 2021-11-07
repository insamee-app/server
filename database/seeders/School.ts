import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import School from 'App/Models/School'
import { Schools } from './data'

export default class SchoolSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'host'

    await School.updateOrCreateMany(uniqueKey, [
      {
        host: 'ecole.fr',
        name: Schools.ECOLE_CENTRE_VAL_LOIRE,
      },
      {
        host: 'ecole-lyon.fr',
        name: Schools.ECOLE_LYON,
      },
      {
        host: 'ecole-strasbourg.fr',
        name: Schools.ECOLE_STRASBOURG,
      },
    ])
  }
}
