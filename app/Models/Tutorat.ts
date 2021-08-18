import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  computed,
  HasOne,
  hasOne,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Profile from 'App/Models/Profile'
import Subject from 'App/Models/Subject'
import School from 'App/Models/School'
import User from './User'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'

export enum TutoratType {
  OFFER = 'offre',
  DEMAND = 'demande',
}

export default class Tutorat extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @belongsTo(() => Profile, { foreignKey: 'userId', localKey: 'userId' })
  public profile: BelongsTo<typeof Profile>

  @belongsTo(() => User, { foreignKey: 'userId', localKey: 'id' })
  public user: BelongsTo<typeof User>

  @column()
  public subjectId: number

  @hasOne(() => Subject, {
    foreignKey: 'id',
    localKey: 'subjectId',
  })
  public subject: HasOne<typeof Subject>

  @column()
  public text?: string

  @column()
  public schoolId: number

  @belongsTo(() => School, { foreignKey: 'schoolId' })
  public school: BelongsTo<typeof School>

  @column()
  public time?: number

  @column()
  public type: TutoratType

  @manyToMany(() => User, {
    localKey: 'id',
    pivotForeignKey: 'tutorat_id',
    pivotRelatedForeignKey: 'user_id',
    relatedKey: 'id',
    pivotTable: 'registration_tutorat',
    serializeAs: 'users_registrations',
  })
  public usersRegistrations: ManyToMany<typeof User>

  @computed({ serializeAs: 'short_text' })
  public get shortText(): string | null {
    if (!this.text) return null

    return this.text.slice(0, 120) + '...'
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
