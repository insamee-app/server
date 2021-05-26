import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable().unique()
      table.string('password', 30).notNullable()
      table.string('remember_me_token').nullable()
      table.boolean('is_verified').defaultTo(false)
      table.string('avatar_id', 40).nullable()
      table.string('last_name', 30).nullable()
      table.string('first_name', 30).nullable()
      table.enu('current_role', ['étudiant', 'personnel']).nullable()
      table.string('text', 2048).nullable()
      table.string('mobile').nullable()
      table.specificType('focus_interest', 'text ARRAY').nullable()
      table.integer('graduation_year').nullable()
      table.json('social_networks').nullable()
      table.integer('school_id').unsigned().notNullable().references('id').inTable('schools')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
