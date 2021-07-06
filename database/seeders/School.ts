import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import School from 'App/Models/School'
import { Schools } from './data'

export default class SchoolSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'host'

    await School.updateOrCreateMany(uniqueKey, [
      {
        host: 'insa-cvl.fr',
        name: Schools.INSA_CENTRE_VAL_LOIRE,
      },
      {
        host: 'insa-lyon.fr',
        name: Schools.INSA_LYON,
      },
      {
        host: 'insa-strasbourg.fr',
        name: Schools.INSA_STRASBOURG,
      },
    ])
  }
}
