import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Association from './Association'

export default class School extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public host: string

  @column()
  public name: string

  @hasMany(() => User)
  public users: HasMany<typeof User>

  @hasMany(() => Association)
  public associations: HasMany<typeof Association>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
