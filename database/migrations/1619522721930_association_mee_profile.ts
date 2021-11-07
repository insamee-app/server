import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AssociationMeeProfile extends BaseSchema {
  protected tableName = 'association_mee_profile'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.primary(['user_id', 'association_id'])

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('user_id')
        .inTable('mee_profiles')

      table
        .integer('association_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('associations')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
