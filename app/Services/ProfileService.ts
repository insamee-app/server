import NotFoundException from 'App/Exceptions/NotFoundException'
import Database from '@ioc:Adonis/Lucid/Database'
import QueryInsameeProfilesValidator from 'App/Validators/QueryInsameeProfilesValidator'
import { DatabaseQueryBuilderContract } from '@ioc:Adonis/Lucid/DatabaseQueryBuilder'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Model'
import InsameeProfile from 'App/Models/InsameeProfile'
import Skill from 'App/Models/Skill'
import FocusInterest from 'App/Models/FocusInterest'
import Association from 'App/Models/Association'

/**
 * Get a user by id
 * @throws {NotFoundException} Will throw an error if a user is not found
 */
export async function getInsameeProfile(id: number): Promise<InsameeProfile> {
  const profile = await InsameeProfile.query()
    .whereExists((query) => {
      query
        .from('users')
        .whereColumn('users.id', 'insamee_profiles.user_id')
        .where('users.is_verified', true)
    })
    .where('user_id', '=', id)
    .limit(1)

  if (!profile[0]) throw new NotFoundException(`Utilisateur ${id} introuvable`)

  return profile[0]
}

/**
 * Used to create a query in a pivot table with a relation with insamee_profile and using the *user_id*
 */
function queryInPivot<T>(name: string, param: string): DatabaseQueryBuilderContract<T> {
  return Database.query()
    .select('user_id')
    .where(`${name}_id`, param)
    .from(`${name}_insamee_profile`)
}

type InsameeProfileValidator = typeof QueryInsameeProfilesValidator

export async function filterInsameeProfiles(
  request: RequestContract,
  validator: InsameeProfileValidator
): Promise<InsameeProfile[] | ModelPaginatorContract<InsameeProfile>> {
  const defaultQuery = {
    page: 1,
    limit: 5,
  }

  const { page, limit, currentRole, skill, focusInterest, association } = await request.validate(
    validator
  )

  const queryProfiles = InsameeProfile.query().whereExists((query) => {
    query
      .from('users')
      .whereColumn('users.id', 'insamee_profiles.user_id')
      .where('users.is_verified', true)
  })

  await preloadInsameeProfile(queryProfiles)

  if (skill) {
    const skillQuery = queryInPivot<Skill>('skill', String(skill))
    queryProfiles.whereIn('user_id', skillQuery)
  }

  if (focusInterest) {
    const focusInterestsQuery = queryInPivot<FocusInterest>('focus_interest', String(focusInterest))
    queryProfiles.whereIn('user_id', focusInterestsQuery)
  }

  if (association) {
    const associationsQuery = queryInPivot<Association>('association', String(association))
    queryProfiles.whereIn('user_id', associationsQuery)
  }

  if (currentRole) queryProfiles.where('currentRole', currentRole)

  const result =
    page || limit
      ? queryProfiles.paginate(page ?? defaultQuery.page, limit ?? defaultQuery.limit)
      : queryProfiles.exec()

  return result
}

/**
 * Preload data on query model
 */
export async function preloadInsameeProfile(
  profile: ModelQueryBuilderContract<typeof InsameeProfile, InsameeProfile>
): Promise<void> {
  await profile.preload('user')
  await profile.preload('school')
  await profile.preload('skills')
  await profile.preload('focusInterests')
  await profile.preload('associations', (association) => {
    association.preload('school')
  })
}

/**
 *  Load data on a user instance
 */
export async function loadInsameeProfile(profile: InsameeProfile): Promise<void> {
  await profile.load('user')
  await profile.load('school')
  await profile.load('skills')
  await profile.load('focusInterests')
  await profile.load('associations', (association) => {
    association.preload('school')
  })
}
