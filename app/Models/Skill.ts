import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Skill extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @manyToMany(() => User, {
    localKey: 'id',
    pivotForeignKey: 'skill_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
  })
  public users: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
