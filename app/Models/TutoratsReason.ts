import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import TutoratsReport from './TutoratsReport'

export default class TutoratsReason extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @hasMany(() => TutoratsReport, {
    localKey: 'id',
    foreignKey: 'reason_id',
  })
  public reports: HasMany<typeof TutoratsReport>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
