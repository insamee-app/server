import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FocusInterestInsameeProfile extends BaseSchema {
  protected tableName = 'focus_interest_insamee_profile'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.primary(['user_id', 'focus_interest_id'])
      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id').references('insamee_profiles.user_id').onDelete('CASCADE')
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
