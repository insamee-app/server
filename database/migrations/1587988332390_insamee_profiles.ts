import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { CurrentRole } from 'App/Models/InsameeProfile'

export default class InsameeProfiles extends BaseSchema {
  protected tableName = 'insamee_profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('user_id')
      table.string('last_name', 30).nullable()
      table.string('first_name', 30).nullable()
      table.enu('current_role', Object.values(CurrentRole)).nullable()
      table.string('text', 2048).nullable()
      table.string('mobile').nullable()
      table.integer('graduation_year').nullable()
      table.string('url_facebook').nullable()
      table.string('url_instagram').nullable()
      table.string('url_twitter').nullable()
      table.integer('school_id').unsigned().notNullable().references('id').inTable('schools')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
