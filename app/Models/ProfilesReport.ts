import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import ProfilesReason from './ProfilesReason'
import User from './User'
import Profile from './Profile'

export default class ProfilesReport extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public reasonId: number

  @column()
  public description: string

  @column()
  public profileId: number

  @column()
  public userId: number

  @belongsTo(() => ProfilesReason, {
    foreignKey: 'reasonId',
    localKey: 'id',
  })
  public reason: BelongsTo<typeof ProfilesReason>

  @belongsTo(() => Profile, {
    foreignKey: 'profileId',
    localKey: 'userId',
  })
  public profile: BelongsTo<typeof Profile>

  @belongsTo(() => User, {
    foreignKey: 'profileId',
    localKey: 'id',
    serializeAs: 'profile_user',
  })
  public profileUser: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'userId',
    localKey: 'id',
  })
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
