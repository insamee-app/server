import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Subject from 'App/Models/Subject'

export default class SubjectSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'name'

    await Subject.updateOrCreateMany(uniqueKey, [
      {
        name: 'mathématiques',
      },
      {
        name: 'svt',
      },
    ])
  }
}
