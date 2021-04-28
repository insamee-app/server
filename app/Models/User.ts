import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import School from './School'
import Association from './Association'
import Skill from './Skill'
import FocusInterest from './FocusInterest'

type socialNetworks = {
  facebook: string
  instagram: string
  twitter: string
  snapchat: string
}

export enum currentRole {
  STUDENT = 'étudiant',
  EMPLOYEE = 'personnel',
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
  public currentRole?: currentRole

  @column()
  public text?: string

  @column()
  public mobile?: string

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

  @manyToMany(() => Association, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'association_id',
  })
  public associations: ManyToMany<typeof Association>

  @manyToMany(() => Skill, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'skill_id',
  })
  public skills: ManyToMany<typeof Skill>

  @manyToMany(() => Skill, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'focus_interest_id',
  })
  public focusInterests: ManyToMany<typeof FocusInterest>

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
