import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Subject from 'App/Models/Subject'
import TutoratProfile from 'App/Models/TutoratProfile'

export default class DifficultiesSubjectTutoratProfileSeeder extends BaseSeeder {
  public async run() {
    const tutoratProfile = await TutoratProfile.firstOrFail()
    const subject = await Subject.firstOrFail()

    await tutoratProfile.related('difficultiesSubjects').sync([subject.id])
  }
}
