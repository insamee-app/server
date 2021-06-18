import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import InsameeProfile from './InsameeProfile'
import School from './School'

export enum CurrentRole {
  STUDENT = 'étudiant',
  EMPLOYEE = 'personnel',
}

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @hasOne(() => InsameeProfile, {
    foreignKey: 'userId',
  })
  public insameeProfile: HasOne<typeof InsameeProfile>

  @column()
  public lastName?: string

  @column()
  public firstName?: string

  @column()
  public avatar?: string

  @column()
  public graduationYear?: number

  @column()
  public urlFacebook?: string

  @column()
  public urlInstagram?: string

  @column()
  public urlTwitter?: string

  @column()
  public mobile?: string

  @column()
  public currentRole?: CurrentRole

  @column()
  public schoolId: number

  @belongsTo(() => School, {
    foreignKey: 'schoolId',
  })
  public school: BelongsTo<typeof School>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
