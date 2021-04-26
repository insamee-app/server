import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.string('last_name').nullable()
      table.string('first_name').nullable()
      table.string('text').nullable()
      table.string('mobile').nullable()
      table.specificType('skills', 'text ARRAY').nullable()
      table.specificType('focus_interest', 'text ARRAY').nullable()
      table.integer('graduation_year').nullable()
      table.json('social_networks').nullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
