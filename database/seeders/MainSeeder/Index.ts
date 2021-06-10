import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Application from '@ioc:Adonis/Core/Application'

export default class IndexSeeder extends BaseSeeder {
  private async runSeeder(seeder: { default: typeof BaseSeeder }) {
    /**
     * Do not run when not in dev mode and seeder is development
     * only
     */
    if (seeder.default.developmentOnly && !Application.inDev) {
      return
    }

    await new seeder.default(this.client).run()
  }

  public async run() {
    await this.runSeeder(await import('../School'))
    await this.runSeeder(await import('../FocusInterest'))
    await this.runSeeder(await import('../Skill'))
    await this.runSeeder(await import('../Association'))
    await this.runSeeder(await import('../User'))
    await this.runSeeder(await import('../InsameeProfile'))
    await this.runSeeder(await import('../FocusInterestUser'))
    await this.runSeeder(await import('../SkillUser'))
    await this.runSeeder(await import('../AssociationUser'))
  }
}
