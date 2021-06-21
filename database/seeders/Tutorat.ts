import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import School from 'App/Models/School'
import Subject from 'App/Models/Subject'
import Tutorat, { TutoratType } from 'App/Models/Tutorat'
import User from 'App/Models/User'

export default class TutoratSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const school = await School.firstOrFail()
    const user = await User.firstOrFail()
    const subject = await Subject.firstOrFail()

    const tutorat: Partial<Tutorat> = {
      userId: user.id,
      schoolId: school.id,
      subjectId: subject.id,
      text: 'this is the text from the tutorat',
      time: 90,
      type: TutoratType.OFFER,
    }

    Tutorat.updateOrCreate({ userId: user.id }, tutorat)
  }
}
