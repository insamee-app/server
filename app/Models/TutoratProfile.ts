import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Subject from './Subject'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'

export default class TutoratProfile extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public userId: number

  @column()
  public text?: string

  @manyToMany(() => Subject, {
    localKey: 'userId',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'subject_id',
    pivotTable: 'preferred_subject_tutorat_profile',
    serializeAs: 'preferred_subjects',
  })
  public preferredSubjects: ManyToMany<typeof Subject>

  @manyToMany(() => Subject, {
    localKey: 'userId',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'subject_id',
    pivotTable: 'difficulties_subject_tutorat_profile',
    serializeAs: 'difficulties_subjects',
  })
  public difficultiesSubjects: ManyToMany<typeof Subject>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
