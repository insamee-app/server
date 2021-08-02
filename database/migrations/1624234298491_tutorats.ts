import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TutoratType } from 'App/Models/Tutorat'

export default class Tutorats extends BaseSchema {
  protected tableName = 'tutorats'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('user_id')
        .inTable('tutorat_profiles')

      table.integer('subject_id').unsigned().notNullable().references('id').inTable('subjects')
      table.integer('school_id').unsigned().notNullable().references('id').inTable('schools')

      table.string('text', 2048).nullable()
      table.integer('time').unsigned().nullable()
      table.enum('type', Object.values(TutoratType))

      table.timestamp('deleted_at', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
