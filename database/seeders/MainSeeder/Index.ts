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
    await this.runSeeder(await import('../Thematic'))
    await this.runSeeder(await import('../Association'))
    await this.runSeeder(await import('../User'))
    await this.runSeeder(await import('../Profile'))
    await this.runSeeder(await import('../MeeProfile'))
    await this.runSeeder(await import('../FocusInterestMeeProfile'))
    await this.runSeeder(await import('../SkillMeeProfile'))
    await this.runSeeder(await import('../AssociationMeeProfile'))
    await this.runSeeder(await import('../Subject'))
    await this.runSeeder(await import('../Tag'))
    await this.runSeeder(await import('../TagAssociation'))
    await this.runSeeder(await import('../TutoratProfile'))
    await this.runSeeder(await import('../Tutorat'))
    await this.runSeeder(await import('../PreferredSubjectTutoratProfile'))
    await this.runSeeder(await import('../DifficultiesSubjectTutoratProfile'))
    await this.runSeeder(await import('../AssociationsReason'))
    await this.runSeeder(await import('../TutoratsReason'))
    await this.runSeeder(await import('../ProfilesReason'))
  }
}
