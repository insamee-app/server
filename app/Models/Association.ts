import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  BelongsTo,
  column,
  HasOne,
  hasOne,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import School from './School'
import Thematic from './Thematic'
import Tag from './Tag'

export default class Association extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public thematicId: number

  @hasOne(() => Thematic, {
    localKey: 'thematicId',
    foreignKey: 'id',
  })
  public thematic: HasOne<typeof Thematic>

  @column()
  public imageUrl: string

  @column()
  public text: string

  @column()
  public email: string

  @column()
  public schoolId: number

  @belongsTo(() => School, {
    foreignKey: 'schoolId',
  })
  public school: BelongsTo<typeof School>

  @manyToMany(() => Tag, {
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'association_id',
    pivotRelatedForeignKey: 'tag_id',
    pivotTable: 'tag_association',
  })
  public tags: ManyToMany<typeof Tag>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
