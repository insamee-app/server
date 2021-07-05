import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Associations extends BaseSchema {
  protected tableName = 'associations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('thematic_id').unsigned().notNullable().references('id').inTable('thematics')
      table.string('image').nullable()
      table.string('name').notNullable()
      table.string('text', 2048).nullable()
      table.string('email').nullable()
      table.integer('school_id').unsigned().notNullable().references('id').inTable('schools')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
