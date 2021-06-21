import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TutoratProfiles extends BaseSchema {
  protected tableName = 'tutorat_profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .unique()
        .references('user_id')
        .inTable('profiles')
      table.string('text', 2048).nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
