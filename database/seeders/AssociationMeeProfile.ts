import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Association from 'App/Models/Association'
import ProfileMee from 'App/Models/MeeProfile'

export default class AssociationMeeProfileSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const profiles = await ProfileMee.withTrashed().exec()
    const associations = await Association.all()

    for (const [index, profile] of profiles.entries()) {
      const value = index + 3
      if (value >= associations.length) break

      const ids = [associations[value].id, associations[value - 1].id, associations[value - 2].id]
      await profile.related('associations').sync([...ids])
    }
  }
}
