import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AssociationUsers extends BaseSchema {
  protected tableName = 'association_users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users')
      table
        .integer('association_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('associations')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
