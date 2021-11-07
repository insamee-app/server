import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasOne,
  HasOne,
  manyToMany,
  ManyToMany,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Profile from 'App/Models/Profile'
import Tutorat from './Tutorat'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import ProfilesReport from './ProfilesReport'
import AssociationsReport from './AssociationsReport'
import TutoratsReport from './TutoratsReport'
export default class User extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @hasOne(() => Profile, {
    foreignKey: 'userId',
  })
  public profile: HasOne<typeof Profile>

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public rememberMeToken?: string

  @column()
  public isVerified: boolean

  @column()
  public isAdmin: boolean

  @column()
  public isModerator: boolean

  @column()
  public isEventCreator: boolean

  @column()
  public isBlocked: boolean

  @column()
  public emailInterestedTutorat: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Tutorat, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'tutorat_id',
    relatedKey: 'id',
    pivotTable: 'interest_tutorat',
    serializeAs: 'tutorat_interested',
    pivotTimestamps: true,
  })
  public tutoratsInterested: ManyToMany<typeof Tutorat>

  @hasMany(() => Tutorat, {
    localKey: 'id',
    foreignKey: 'userId',
    serializeAs: 'tutorats_created',
  })
  public tutoratsCreated: HasMany<typeof Tutorat>

  @hasMany(() => ProfilesReport, {
    localKey: 'id',
    foreignKey: 'userId',
    serializeAs: 'reported_profiles',
  })
  public reportedProfiles: HasMany<typeof ProfilesReport>

  @hasMany(() => AssociationsReport, {
    localKey: 'id',
    foreignKey: 'userId',
    serializeAs: 'reported_associations',
  })
  public reportedAssociations: HasMany<typeof AssociationsReport>

  @hasMany(() => TutoratsReport, {
    localKey: 'id',
    foreignKey: 'userId',
    serializeAs: 'reported_tutorats',
  })
  public reportedTutorats: HasMany<typeof TutoratsReport>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
