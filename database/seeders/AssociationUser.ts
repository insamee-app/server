import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Association from 'App/Models/Association'
import User from 'App/Models/User'

export default class AssociationUserSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const user = await User.first()
    const association = await Association.first()

    if (association?.id) {
      await user?.related('associations').sync([association.id])
    }
  }
}
