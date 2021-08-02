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
} from '@ioc:Adonis/Lucid/Orm'
import Profile from 'App/Models/Profile'
import Tutorat from './Tutorat'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Tutorat, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'tutorat_id',
    relatedKey: 'id',
    pivotTable: 'registration_tutorat',
    serializeAs: 'tutorats_registrations',
  })
  public tutoratsRegistrations: ManyToMany<typeof Tutorat>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
