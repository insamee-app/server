import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Subject from 'App/Models/Subject'
import TutoratProfile from 'App/Models/TutoratProfile'

export default class DifficultiesSubjectTutoratProfileSeeder extends BaseSeeder {
  public async run() {
    const profiles = await TutoratProfile.withTrashed().exec()
    const subjects = await Subject.all()

    for (const [index, profile] of profiles.entries()) {
      const value = index + 3
      if (value >= subjects.length) break

      const ids = [subjects[value].id, subjects[value - 1].id, subjects[value - 2].id]
      await profile.related('difficultiesSubjects').sync([...ids])
    }
  }
}
