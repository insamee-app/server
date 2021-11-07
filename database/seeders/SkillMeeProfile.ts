import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Skill from 'App/Models/Skill'
import ProfileMee from 'App/Models/MeeProfile'

export default class SkillMeeProfileSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const profiles = await ProfileMee.withTrashed().exec()
    const skills = await Skill.all()

    for (const [index, profile] of profiles.entries()) {
      const value = index + 3
      if (value >= skills.length) break

      const ids = [skills[value].id, skills[value - 1].id, skills[value - 2].id]
      await profile.related('skills').sync([...ids])
    }
  }
}
