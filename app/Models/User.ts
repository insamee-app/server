import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import School from './School'

type socialNetworks = {
  facebook: string
  instagram: string
  twitter: string
  snapchat: string
}

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  public lastName?: string

  @column()
  public firstName?: string

  @column()
  public text?: string

  @column()
  public mobile?: string

  @column()
  public skills?: Array<string>

  @column()
  public focusInterest?: Array<string>

  @column()
  public graduationYear?: number

  @column()
  public socialNetworks?: Partial<socialNetworks>

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

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
