import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Skill from 'App/Models/Skill'

export default class SkillSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'name'

    await Skill.updateOrCreateMany(uniqueKey, [
      {
        name: "travaille d'équipe",
      },
      {
        name: 'communication',
      },
      {
        name: 'sens du relationnel',
      },
      {
        name: "capacité d'adaptation",
      },
      {
        name: 'autonomie',
      },
      {
        name: "prise d'initiatives",
      },
      {
        name: 'créativité',
      },
      {
        name: 'organisation',
      },
      {
        name: 'prise de décisions',
      },
      {
        name: 'esprit de synthèse',
      },
      {
        name: 'rigueur',
      },
      {
        name: 'fiabilité',
      },
      {
        name: 'ponctualité',
      },
      {
        name: 'détermination',
      },
      {
        name: 'curiosité',
      },
      {
        name: 'polyvalence',
      },
      {
        name: 'résistance au stresse',
      },
      {
        name: 'empathie',
      },
      {
        name: "ouverture d'esprit",
      },
    ])
  }
}
