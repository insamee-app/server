import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RegistrationTutorat extends BaseSchema {
  protected tableName = 'registration_tutorat'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.primary(['user_id', 'tutorat_id'])

      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id').references('tutorat_profiles.user_id').onDelete('CASCADE')

      table.integer('tutorat_id').unsigned().notNullable().references('id').inTable('tutorats')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
