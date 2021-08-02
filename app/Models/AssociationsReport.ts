import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import AssociationsReason from './AssociationsReason'
import Association from './Association'
import User from './User'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'

export default class AssociationsReport extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public reasonId: number

  @column()
  public description: string

  @column()
  public associationId: number

  @column()
  public userId: number

  @belongsTo(() => AssociationsReason, { foreignKey: 'reasonId', localKey: 'id' })
  public reason: BelongsTo<typeof AssociationsReason>

  @belongsTo(() => Association, { foreignKey: 'associationId', localKey: 'id' })
  public association: BelongsTo<typeof Association>

  @belongsTo(() => User, { foreignKey: 'userId', localKey: 'id' })
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
