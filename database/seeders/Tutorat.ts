import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import School from 'App/Models/School'
import Subject from 'App/Models/Subject'
import Tutorat, { TutoratSiting, TutoratType } from 'App/Models/Tutorat'
import User from 'App/Models/User'
import { texts } from './utils'

export default class TutoratSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const school = await School.findByOrFail('host', 'insa-cvl.fr')
    const users = await User.withTrashed().exec()
    const subjects = await Subject.all()

    for (const [index, user] of users.entries()) {
      const type = index % 2 ? TutoratType.OFFER : TutoratType.DEMAND
      const siting = index % 2 ? TutoratSiting.ONLINE : TutoratSiting.IN_PERSON
      for (let i = 0; i < 4; i++) {
        const value = index + i
        const subjectId = subjects[value % subjects.length].id
        await Tutorat.updateOrCreate(
          { userId: user.id, subjectId },
          {
            userId: user.id,
            schoolId: school.id,
            subjectId,
            text: texts[value % texts.length],
            time: type === TutoratType.OFFER ? 90 : undefined,
            type,
            siting,
            deletedAt: user.deletedAt,
          }
        )
      }
    }
  }
}
