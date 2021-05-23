import NotFoundException from 'App/Exceptions/NotFoundException'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'
import QueryUsersValidator from 'App/Validators/QueryUsersValidator'
import {
  DatabaseQueryBuilderContract,
  SimplePaginatorContract,
} from '@ioc:Adonis/Lucid/DatabaseQueryBuilder'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Model'

/**
 * Get a user by id
 * @throws {NotFoundException} Will throw an error if a user is not found
 */
export async function getUser(id: number): Promise<User> {
  const user = await User.findOrFail(id)

  if (!user.isVerified) throw new NotFoundException(`Utilisateur ${id} introuvable`)

  return user
}

/**
 * Used to create a query in a pivot table with a relation with user and using the *user_id*
 */
function queryInPivot(name: string, param: string): DatabaseQueryBuilderContract<any> {
  return Database.query().select('user_id').where(`${name}_id`, param).from(`${name}_user`)
}

type UserValidator = typeof QueryUsersValidator

export async function filterUsers(
  request: RequestContract,
  validator: UserValidator
): Promise<User[] | SimplePaginatorContract<User>> {
  const defaultQuery = {
    page: 1,
    limit: 5,
  }

  const { page, limit, currentRole, skill, focusInterest, association } = await request.validate(
    validator
  )

  const queryUsers = User.query().where('is_verified', true)

  await preloadUser(queryUsers)

  if (skill) {
    const skillQuery = queryInPivot('skill', String(skill))
    queryUsers.whereIn('id', skillQuery)
  }

  if (focusInterest) {
    const focusInterestsQuery = queryInPivot('focus_interest', String(focusInterest))
    queryUsers.whereIn('id', focusInterestsQuery)
  }

  if (association) {
    const associationsQuery = queryInPivot('association', String(association))
    queryUsers.whereIn('id', associationsQuery)
  }

  if (currentRole) queryUsers.where('currentRole', currentRole)

  const result =
    page || limit
      ? queryUsers.paginate(page ?? defaultQuery.page, limit ?? defaultQuery.limit)
      : queryUsers.exec()

  return result
}

/**
 *  Preload data on a user or a query builder
 */
export async function preloadUser(
  user: User | ModelQueryBuilderContract<typeof User, User>
): Promise<void> {
  await user.preload('school')
  await user.preload('skills')
  await user.preload('focusInterests')
  await user.preload('associations', (association) => {
    association.preload('school')
  })
}
