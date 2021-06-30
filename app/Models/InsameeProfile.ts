import { DateTime } from 'luxon'
import { column, BaseModel, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Association from './Association'
import Skill from './Skill'
import FocusInterest from './FocusInterest'

export default class InsameeProfile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public text?: string

  @manyToMany(() => Association, {
    localKey: 'userId',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'association_id',
    pivotTable: 'association_insamee_profile',
  })
  public associations: ManyToMany<typeof Association>

  @manyToMany(() => Skill, {
    localKey: 'userId',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'skill_id',
    pivotTable: 'skill_insamee_profile',
  })
  public skills: ManyToMany<typeof Skill>

  @manyToMany(() => FocusInterest, {
    localKey: 'userId',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'focus_interest_id',
    pivotTable: 'focus_interest_insamee_profile',
    serializeAs: 'focus_interests',
  })
  public focusInterests: ManyToMany<typeof FocusInterest>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
