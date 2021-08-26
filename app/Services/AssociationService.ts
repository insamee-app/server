import Association from 'App/Models/Association'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { DatabaseQueryBuilderContract } from '@ioc:Adonis/Lucid/Database'
import Database from '@ioc:Adonis/Lucid/Database'
import Tag from 'App/Models/Tag'
import NotFoundException from 'App/Exceptions/NotFoundException'

/**
 * Get an association by id
 * @throws {NotFoundException} Will throw an error if an association is not found
 */
export async function getAssociation(id: number, isAdmin: boolean = false): Promise<Association> {
  let association: Association
  try {
    const associationQuery = Association.query().where('id', id)

    if (isAdmin) associationQuery.withTrashed()

    association = await associationQuery.firstOrFail()
  } catch (error) {
    throw new NotFoundException('Association introuvable')
  }

  return association
}

/**
 * Used to create a query in a pivot table with a relation with association and using the *id*
 */
function queryInPivot<T>(name: string, param: number[]): DatabaseQueryBuilderContract<T> {
  return Database.from(`${name}_association`).select('association_id').whereIn(`${name}_id`, param)
}

/**
 * Used to filter associations
 */
export function filterAssociations(
  associations: ModelQueryBuilderContract<typeof Association, Association>,
  name: string | undefined,
  thematics: Array<number> | undefined,
  tags: Array<number> | undefined,
  schools: Array<number> | undefined
): ModelQueryBuilderContract<typeof Association, Association> {
  if (name) {
    // associations.whereRaw('name @@ :term', { term: '%' + name + '%' }) // useful for text but not name (% is useless on full text search)
    // associations.whereRaw(`to_tsvector(name) @@ to_tsquery(%${name}%')`)
    associations.where('name', 'LIKE', `%${name}%`)
  }

  if (thematics) {
    associations.whereIn('thematic_id', thematics)
  }

  if (tags) {
    const queryTags = queryInPivot<Tag>('tag', tags)
    associations.whereIn('id', queryTags)
  }

  if (schools) {
    associations.whereIn('school_id', schools)
  }

  return associations
}

/**
 * Load data for an association instance
 */
export async function loadAssociation(association: Association): Promise<void> {
  await association.load((loader) => {
    loader.load('thematic').load('school').load('tags')
  })
}
