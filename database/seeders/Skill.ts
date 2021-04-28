import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Skill from 'App/Models/Skill'

export default class SkillSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'name'

    await Skill.updateOrCreateMany(uniqueKey, [
      {
        name: 'travaille en équipe',
      },
    ])
  }
}
