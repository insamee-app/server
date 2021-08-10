import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProfilesReports extends BaseSchema {
  protected tableName = 'profiles_reports'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.unique(['user_id', 'profile_id', 'deleted_at'])

      table
        .integer('reason_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('profiles_reasons')
      table.string('description').nullable()
      table.integer('profile_id').unsigned().notNullable().references('id').inTable('users')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users')

      table.timestamp('deleted_at', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
