import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Skill from 'App/Models/Skill'
import ProfileInsamee from 'App/Models/InsameeProfile'

export default class SkillInsameeProfileSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const profile = await ProfileInsamee.first()
    const skill = await Skill.first()

    if (skill?.id) {
      await profile?.related('skills').sync([skill.id])
    }
  }
}
