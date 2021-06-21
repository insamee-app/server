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
    await this.runSeeder(await import('../Profile'))
    await this.runSeeder(await import('../InsameeProfile'))
    await this.runSeeder(await import('../FocusInterestInsameeProfile'))
    await this.runSeeder(await import('../SkillInsameeProfile'))
    await this.runSeeder(await import('../AssociationInsameeProfile'))
    await this.runSeeder(await import('../Subject'))
    await this.runSeeder(await import('../Tutorat'))
    await this.runSeeder(await import('../TutoratProfile'))
    await this.runSeeder(await import('../PreferredSubjectTutoratProfile'))
    await this.runSeeder(await import('../DifficultiesSubjectTutoratProfile'))
  }
}
