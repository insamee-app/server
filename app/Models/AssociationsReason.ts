import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import AssociationsReport from './AssociationsReport'

export default class AssociationsReason extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @hasMany(() => AssociationsReport, {
    localKey: 'id',
    foreignKey: 'reason_id',
  })
  public reports: HasMany<typeof AssociationsReport>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
