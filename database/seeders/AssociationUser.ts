import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Association from 'App/Models/Association'
import ProfileInsamee from 'App/Models/InsameeProfile'

export default class AssociationUserSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const profile = await ProfileInsamee.first()
    const association = await Association.first()

    if (association?.id) {
      await profile?.related('associations').sync([association.id])
    }
  }
}
