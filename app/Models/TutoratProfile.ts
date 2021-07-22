import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Subject from './Subject'

export default class TutoratProfile extends BaseModel {
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
  })
  public preferredSubjects: ManyToMany<typeof Subject>

  @manyToMany(() => Subject, {
    localKey: 'userId',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'subject_id',
    pivotTable: 'difficulties_subject_tutorat_profile',
  })
  public difficultiesSubjects: ManyToMany<typeof Subject>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
