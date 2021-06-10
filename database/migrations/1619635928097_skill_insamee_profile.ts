import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SkillInsameeProfile extends BaseSchema {
  protected tableName = 'skill_insamee_profile'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('user_id')
        .inTable('insamee_profiles')
      table.integer('skill_id').unsigned().notNullable().references('id').inTable('skills')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}