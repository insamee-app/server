import { ModelAttributes } from '@ioc:Adonis/Lucid/Orm'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Association from 'App/Models/Association'
import School from 'App/Models/School'
import Thematic from 'App/Models/Thematic'

export default class AssociationSeeder extends BaseSeeder {
  public async run() {
    const uniqueKeys = ['name', 'schoolId'] as (keyof ModelAttributes<Association>)[]

    await insaCvl(uniqueKeys)
  }
}

async function insaCvl(uniqueKeys: (keyof ModelAttributes<Association>)[]) {
  const cultural = [
    'insarpège',
    "dancin'sa",
    "ins'brasse",
    "comed'insa bourges",
    "comed'insa blois",
    'printemps des grandes écoles',
    "ins'agora",
    'club oenologie',
    "ins'action",
  ]

  const solidarity = ['5s5c', 'esf', 'insactif', "jard'insa", 'r3', 'insagénieuse']

  const school = await School.findByOrFail('host', 'insa-cvl.fr')
  await Association.updateOrCreateMany(uniqueKeys, [
    ...(await createAssociations(cultural, 'culturel', school)),
    ...(await createAssociations(solidarity, 'solidarités', school)),
  ])
}

async function createAssociations(associations: string[], thematicName: string, school: School) {
  const thematic = await Thematic.findByOrFail('name', thematicName)

  return associations.map(
    (association) =>
      ({
        name: association,
        schoolId: school.id,
        thematicId: thematic.id,
      } as Partial<Association>)
  )
}
