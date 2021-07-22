import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { CurrentRole } from 'App/Models/Profile'

export default class Profiles extends BaseSchema {
  protected tableName = 'profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').primary()
      table.foreign('user_id').references('users.id').onDelete('CASCADE')

      table.string('last_name', 30).nullable()
      table.string('first_name', 30).nullable()
      table.integer('graduation_year').nullable()
      table.string('avatar', 40).nullable()
      table.integer('school_id').unsigned().notNullable().references('id').inTable('schools')
      table.string('url_facebook').nullable()
      table.string('url_instagram').nullable()
      table.string('url_twitter').nullable()
      table.string('mobile').nullable()
      table.enu('current_role', Object.values(CurrentRole)).nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
