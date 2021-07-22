import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TutoratsReports extends BaseSchema {
  protected tableName = 'tutorats_reports'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('reason_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tutorats_reasons')
      table.string('description').nullable()
      table.integer('tutorat_id').unsigned().notNullable().references('id').inTable('tutorats')

      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id').references('tutorat_profiles.user_id').onDelete('CASCADE')

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
