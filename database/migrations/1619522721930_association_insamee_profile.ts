import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AssociationInsameeProfile extends BaseSchema {
  protected tableName = 'association_insamee_profile'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.primary(['user_id', 'association_id'])
      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id').references('insamee_profiles.user_id').onDelete('CASCADE')
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
