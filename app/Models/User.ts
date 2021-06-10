import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import InsameeProfile from 'App/Models/InsameeProfile'
export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasOne(() => InsameeProfile, {
    foreignKey: 'userId',
  })
  public insameeProfile: HasOne<typeof InsameeProfile>

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  public isVerified: boolean

  @column()
  public avatarId?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
