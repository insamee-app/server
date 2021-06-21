import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DifficultiesSubjectTutoratProfile extends BaseSchema {
  protected tableName = 'difficulties_subject_tutorat_profile'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('user_id')
        .inTable('tutorat_profiles')
      table.integer('subject_id').unsigned().notNullable().references('id').inTable('subjects')

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
