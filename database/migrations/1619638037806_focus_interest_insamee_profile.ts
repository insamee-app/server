import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FocusInterestInsameeProfile extends BaseSchema {
  protected tableName = 'focus_interest_insamee_profile'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('user_id')
        .inTable('insamee_profiles')
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
