import Database from '@ioc:Adonis/Lucid/Database'
import InsameeProfileQueryValidator from 'App/Validators/InsameeProfileQueryValidator'
import { DatabaseQueryBuilderContract } from '@ioc:Adonis/Lucid/DatabaseQueryBuilder'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Model'
import NotFoundException from 'App/Exceptions/NotFoundException'
import InsameeProfile from 'App/Models/InsameeProfile'
import Skill from 'App/Models/Skill'
import FocusInterest from 'App/Models/FocusInterest'
import Association from 'App/Models/Association'
import Profile, { Populate } from 'App/Models/Profile'
import ProfileQueryValidator from 'App/Validators/ProfileQueryValidator'

/**
 * Get a profile by id
 * @throws {NotFoundException} Will throw an error if a profile is not found
 */
export async function getProfile(id: number): Promise<Profile> {
  const profile = await Profile.query()
    .whereExists((query) => {
      query
        .from('users')
        .whereColumn('users.id', 'profiles.user_id')
        .where('users.is_verified', true)
    })
    .where('user_id', '=', id)
    .limit(1)

  if (!profile[0]) throw new NotFoundException(`Utilisateur introuvable`)

  return profile[0]
}

/**
 * Get a profile by id
 * @throws {NotFoundException} Will throw an error if a profile is not found
 */
export async function getInsameeProfile(id: number): Promise<InsameeProfile> {
  const insameeProfile = await InsameeProfile.query()
    .whereExists((query) => {
      query
        .from('users')
        .whereColumn('users.id', 'insamee_profiles.user_id')
        .where('users.is_verified', true)
    })
    .where('user_id', '=', id)
    .limit(1)

  if (!insameeProfile[0]) throw new NotFoundException(`Utilisateur introuvable`)

  return insameeProfile[0]
}

/**
 * Used to create a query in a pivot table with a relation with insamee_profile and using the *user_id*
 */
function queryInPivot<T>(name: string, param: string): DatabaseQueryBuilderContract<T> {
  return Database.from(`${name}_insamee_profile`).select('user_id').where(`${name}_id`, param)
}

type TInsameeProfileValidator = typeof InsameeProfileQueryValidator
type TProfileValidator = typeof ProfileQueryValidator

export async function filterProfiles(
  request: RequestContract,
  profileValidator: TProfileValidator,
  insameeValidator: TInsameeProfileValidator
): Promise<InsameeProfile[] | ModelPaginatorContract<InsameeProfile>> {
  const defaultQuery = {
    page: 1,
    limit: 5,
  }

  // pour l'ajout de tutorat, il va falloir découper en fonction
  const { limit, page, populate } = await request.validate(profileValidator)
  const { currentRole, skill, focusInterest, association } = await request.validate(
    insameeValidator
  )

  const queryProfiles = Profile.query().whereExists((query) => {
    query.from('users').whereColumn('users.id', 'profiles.user_id').where('users.is_verified', true)
  })

  switch (populate) {
    case Populate.INSAMEE:
      await preloadInsameeProfile(queryProfiles)
      break
    case Populate.TUTORAT:
      break
    default:
      break
  }

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
  profiles: ModelQueryBuilderContract<typeof Profile, Profile>
): Promise<void> {
  await profiles
    .preload('insameeProfile', (insameeProfilesQuery) => {
      insameeProfilesQuery.preload('skills')
      insameeProfilesQuery.preload('focusInterests')
      insameeProfilesQuery.preload('associations', (association) => {
        association.preload('school')
      })
    })
    .preload('user')
    .preload('school')
}

/**
 *  Load data on a user instance
 */
export async function loadInsameeProfile(profile: Profile): Promise<void> {
  await profile.load((loader) => {
    loader
      .load('insameeProfile', (insameeProfile) => {
        insameeProfile.preload('skills')
        insameeProfile.preload('focusInterests')
        insameeProfile.preload('associations', (association) => {
          association.preload('school')
        })
      })
      .load('user')
  })
}

/**
 * Populate data on a profile
 */
export async function populateProfile(
  profile: Profile,
  populate: Populate | undefined
): Promise<void> {
  switch (populate) {
    case Populate.INSAMEE:
      await loadInsameeProfile(profile)
      break
    case Populate.TUTORAT:
      break
    default:
      break
  }
}
