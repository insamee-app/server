import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Skill from 'App/Models/Skill'
import User from 'App/Models/User'

export default class SkillUserSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const user = await User.first()
    const skill = await Skill.first()

    if (skill?.id) {
      await user?.related('skills').sync([skill.id])
    }
  }
}
