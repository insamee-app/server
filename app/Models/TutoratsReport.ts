import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import TutoratsReason from './TutoratsReason'
import Tutorat from './Tutorat'
import User from './User'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import Profile from './Profile'

export default class TutoratsReport extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public reasonId: number

  @column()
  public description: string

  @column()
  public tutoratId: number

  @column()
  public userId: number

  @belongsTo(() => TutoratsReason, { foreignKey: 'reasonId', localKey: 'id' })
  public reason: BelongsTo<typeof TutoratsReason>

  @belongsTo(() => Tutorat, { foreignKey: 'tutoratId', localKey: 'id' })
  public tutorat: BelongsTo<typeof Tutorat>

  @belongsTo(() => User, { foreignKey: 'userId', localKey: 'id' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Profile, { foreignKey: 'userId', localKey: 'userId' })
  public profile: BelongsTo<typeof Profile>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
