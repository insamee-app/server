import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FocusInterestUser extends BaseSchema {
  protected tableName = 'focus_interest_user'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users')
      table
        .integer('focus_interest_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('focus_interests')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
