import Association from 'App/Models/Association'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { DatabaseQueryBuilderContract } from '@ioc:Adonis/Lucid/Database'
import Database from '@ioc:Adonis/Lucid/Database'
import Tag from 'App/Models/Tag'

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
    associations.whereRaw('name @@ :term', { term: '%' + name + '%' })
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
