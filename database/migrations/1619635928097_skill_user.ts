import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SkillUser extends BaseSchema {
  protected tableName = 'skill_user'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users')
      table.integer('skill_id').unsigned().notNullable().references('id').inTable('skills')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
