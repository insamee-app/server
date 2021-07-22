import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TutoratsReports extends BaseSchema {
  protected tableName = 'tutorats_reports'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.primary(['user_id', 'tutorat_id', 'deleted_at'])

      table
        .integer('reason_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tutorats_reasons')
      table.string('description').nullable()
      table.integer('tutorat_id').unsigned().notNullable().references('id').inTable('tutorats')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('user_id')
        .inTable('tutorat_profiles')

      table.timestamp('deleted_at', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
