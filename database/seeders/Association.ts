import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Association from 'App/Models/Association'
import School from 'App/Models/School'
import Thematic from 'App/Models/Thematic'
import Associations from './data/associations'

export default class AssociationSeeder extends BaseSeeder {
  public async run() {
    for (const association of Associations) {
      const schoolId = (await School.findByOrFail('name', association.school)).id
      const thematicId = (await Thematic.findByOrFail('name', association.thematic)).id

      await Association.updateOrCreate(
        { name: association.name, schoolId },
        {
          name: association.name,
          text: association.text,
          email: association.email,
          schoolId,
          thematicId,
        }
      )
    }
  }
}
