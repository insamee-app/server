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

export async function getUser(id: number): Promise<User> {
  const user = await User.find(id)

  if (!user) throw new NotFoundException(`Utilisateur ${id} introuvable`)

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

  const queryUsers = User.query()

  await preloadUser(queryUsers)

  if (skill) {
    const skillQuery = queryInPivot('skill', skill)
    queryUsers.whereIn('id', skillQuery)
  }

  if (focusInterest) {
    const focusInterestsQuery = queryInPivot('focus_interest', focusInterest)
    queryUsers.whereIn('id', focusInterestsQuery)
  }

  if (association) {
    const associationsQuery = queryInPivot('association', association)
    queryUsers.whereIn('id', associationsQuery)
  }

  if (currentRole) queryUsers.where('currentRole', currentRole)

  const result =
    page || limit
      ? queryUsers.paginate(page ?? defaultQuery.page, limit ?? defaultQuery.limit)
      : queryUsers.exec()

  return result
}

export async function preloadUser(
  user: User | ModelQueryBuilderContract<typeof User, User>
): Promise<void> {
  await user.preload('school')
  await user.preload('skills')
  await user.preload('focusInterests')
  await user.preload('associations')
}
