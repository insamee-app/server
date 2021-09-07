import { DateTime } from 'luxon'
import { column, BaseModel, manyToMany, ManyToMany, computed } from '@ioc:Adonis/Lucid/Orm'
import Association from './Association'
import Skill from './Skill'
import FocusInterest from './FocusInterest'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class InsameeProfile extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
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

  @computed({ serializeAs: 'short_text' })
  public get shortText(): string | null {
    if (!this.text) return null

    return string.truncate(this.text, 120, { completeWords: true })
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
