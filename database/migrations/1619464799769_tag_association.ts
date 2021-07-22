import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TagAssociation extends BaseSchema {
  protected tableName = 'tag_association'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.primary(['tag_id', 'association_id'])

      table.integer('tag_id').unsigned().notNullable().references('id').inTable('tags')
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
