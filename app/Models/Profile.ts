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
import MeeProfile from './MeeProfile'
import School from './School'
import TutoratProfile from './TutoratProfile'
import Tutorat from './Tutorat'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'

export enum CurrentRole {
  STUDENT = 'étudiant',
  EMPLOYEE = 'personnel',
}

export enum Populate {
  MEE = 'mee',
  TUTORAT = 'tutorat',
  ADMIN = 'admin',
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

  @hasOne(() => MeeProfile, {
    localKey: 'userId',
    foreignKey: 'userId',
    serializeAs: 'mee_profile',
  })
  public meeProfile: HasOne<typeof MeeProfile>

  @hasOne(() => TutoratProfile, {
    localKey: 'userId',
    foreignKey: 'userId',
    serializeAs: 'tutorat_profile',
  })
  public tutoratProfile: HasOne<typeof TutoratProfile>

  @column()
  public lastName?: string

  @column()
  public firstName?: string

  @attachment({ folder: 'profiles' })
  public picture?: AttachmentContract | null

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

  @computed({ serializeAs: 'url_picture' })
  public get urlPicture(): string | null {
    if (!this.picture) return null

    return `${process.env.BACK_HOST}/uploads/${this.picture.name}`
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
