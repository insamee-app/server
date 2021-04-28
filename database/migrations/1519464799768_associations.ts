import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Associations extends BaseSchema {
  protected tableName = 'associations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.integer('school_id').unsigned().notNullable().references('id').inTable('schools')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
