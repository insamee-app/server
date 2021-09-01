import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  BelongsTo,
  column,
  computed,
  HasOne,
  hasOne,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import School from './School'
import Thematic from './Thematic'
import Tag from './Tag'
import Application from '@ioc:Adonis/Core/Application'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'

export default class Association extends compose(BaseModel, SoftDeletes) {
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
  public picture?: string

  @column()
  public text?: string

  @column()
  public email?: string

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
    pivotTimestamps: true,
  })
  public tags: ManyToMany<typeof Tag>

  @computed({ serializeAs: 'url_picture' })
  public get urlPicture(): string | null {
    if (!this.picture) return null

    return `${process.env.BACK_HOST}/uploads/associations/${this.picture}`
  }

  @computed({ serializeAs: 'short_text' })
  public get shortText(): string | null {
    if (!this.text) return null

    return this.text.slice(0, 120) + '...'
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
