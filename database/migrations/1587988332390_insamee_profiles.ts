import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class InsameeProfiles extends BaseSchema {
  protected tableName = 'insamee_profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .primary()
        .references('user_id')
        .inTable('profiles')

      table.string('text', 2048).nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
