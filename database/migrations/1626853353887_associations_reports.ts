import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AssociationsReports extends BaseSchema {
  protected tableName = 'associations_reports'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.primary(['user_id', 'association_id', 'deleted_at'])

      table
        .integer('reason_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('associations_reasons')
      table.string('description').nullable()
      table
        .integer('association_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('associations')

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('user_id')
        .inTable('insamee_profiles')

      table.timestamp('deleted_at', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
