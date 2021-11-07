import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FocusInterestMeeProfile extends BaseSchema {
  protected tableName = 'focus_interest_mee_profile'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.primary(['user_id', 'focus_interest_id'])

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('user_id')
        .inTable('mee_profiles')

      table
        .integer('focus_interest_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('focus_interests')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
