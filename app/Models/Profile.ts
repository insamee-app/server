import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasOne,
  HasOne,
  computed,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import InsameeProfile from './InsameeProfile'
import School from './School'
import TutoratProfile from './TutoratProfile'
import Application from '@ioc:Adonis/Core/Application'
import Tutorat from './Tutorat'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'

export enum CurrentRole {
  STUDENT = 'étudiant',
  EMPLOYEE = 'personnel',
}

export enum Populate {
  INSAMEE = 'insamee',
  TUTORAT = 'tutorat',
  FULL = 'full',
  NONE = 'none',
}

export default class Profile extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public userId: number

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @hasOne(() => InsameeProfile, {
    localKey: 'userId',
    foreignKey: 'userId',
    serializeAs: 'insamee_profile',
  })
  public insameeProfile: HasOne<typeof InsameeProfile>

  @hasOne(() => TutoratProfile, {
    localKey: 'userId',
    foreignKey: 'userId',
  })
  public tutoratProfile: HasOne<typeof TutoratProfile>

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

  @manyToMany(() => Tutorat, {
    localKey: 'userId',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'tutorat_id',
    relatedKey: 'id',
    pivotTable: 'registration_tutorat',
    serializeAs: 'tutorats_registrations',
  })
  public tutoratsRegistrations: ManyToMany<typeof Tutorat>

  // @hasManyThrough([() => Skill, () => InsameeProfile], {
  //   localKey: 'userId',
  //   foreignKey: 'userId',
  //   throughForeignKey: 'id',
  // })
  // public skills: HasManyThrough<typeof Skill>

  @computed({ serializeAs: 'avatar_url' })
  public get avatarUrl(): string | null {
    if (!this.avatar) return null

    if (Application.inDev) {
      return `${process.env.BACK_HOST}/api/v1/uploads/${this.avatar}`
    } else return null
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
