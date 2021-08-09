import Database from '@ioc:Adonis/Lucid/Database'
import { DatabaseQueryBuilderContract } from '@ioc:Adonis/Lucid/Database'
import { CherryPick, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import NotFoundException from 'App/Exceptions/NotFoundException'
import InsameeProfile from 'App/Models/InsameeProfile'
import Skill from 'App/Models/Skill'
import FocusInterest from 'App/Models/FocusInterest'
import Association from 'App/Models/Association'
import Profile, { CurrentRole, Populate } from 'App/Models/Profile'
import TutoratProfile from 'App/Models/TutoratProfile'

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
 * Get an insamee profile by id
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
 * Get a tutorat profile by id
 * @throws {NotFoundException} Will throw an error if a profile is not found
 */
export async function getTutoratProfile(id: number): Promise<TutoratProfile> {
  const tutoratProfile = await TutoratProfile.query()
    .whereExists((query) => {
      query
        .from('users')
        .whereColumn('users.id', 'tutorat_profiles.user_id')
        .where('users.is_verified', true)
    })
    .where('user_id', '=', id)
    .limit(1)

  if (!tutoratProfile[0]) throw new NotFoundException(`Utilisateur introuvable`)

  return tutoratProfile[0]
}

/**
 * Used to create a query in a pivot table with a relation with insamee_profile and using the *user_id*
 */
function queryInPivot<T>(name: string, param: number[]): DatabaseQueryBuilderContract<T> {
  return Database.from(`${name}_insamee_profile`).select('user_id').whereIn(`${name}_id`, param)
}

export function filterProfiles(
  profiles: ModelQueryBuilderContract<typeof Profile, Profile>,
  // text: string | undefined,
  currentRole: CurrentRole | undefined,
  skills: number[] | undefined,
  focusInterests: number[] | undefined,
  associations: number[] | undefined
): ModelQueryBuilderContract<typeof Profile, Profile> {
  profiles.whereExists((query) => {
    query.from('users').whereColumn('users.id', 'profiles.user_id').where('users.is_verified', true)
  })

  profiles
    // .if(text, (query) => {
    //   // query.whereRaw(`to_tsvector(first_name) @@ to_tsquery('${text}')`)
    // })
    .if(skills, (query) => {
      const skillQuery = queryInPivot<Skill>('skill', skills!)
      query.whereIn('user_id', skillQuery)
    })
    .if(focusInterests, (query) => {
      const focusInterestsQuery = queryInPivot<FocusInterest>('focus_interest', focusInterests!)
      query.whereIn('user_id', focusInterestsQuery)
    })
    .if(associations, (query) => {
      const associationsQuery = queryInPivot<Association>('association', associations!)
      query.whereIn('user_id', associationsQuery)
    })
    .if(currentRole, (query) => {
      query.where('currentRole', '=', currentRole!)
    })

  return profiles
}

/**
 * Preload data on insamee profile model
 */
export function preloadInsameeProfile(
  profiles: ModelQueryBuilderContract<typeof Profile, Profile>
) {
  profiles
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
 * Preload data on tutorat profile model
 */
export function preloadTutoratProfile(
  profiles: ModelQueryBuilderContract<typeof Profile, Profile>
) {
  profiles
    .preload('tutoratProfile', (tutoratProfileQuery) => {
      tutoratProfileQuery.preload('preferredSubjects')
      tutoratProfileQuery.preload('difficultiesSubjects')
    })
    .preload('user')
    .preload('school')
}

/**
 *  Load data for insamee on a profile instance
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
      .load('school')
      .load('user')
  })
}

/**
 *  Load data for tutorat on a profile instance
 */
export async function loadTutoratProfile(profile: Profile): Promise<void> {
  await profile.load((loader) => {
    loader
      .load('tutoratProfile', (tutoratProfile) => {
        tutoratProfile.preload('difficultiesSubjects')
        tutoratProfile.preload('preferredSubjects')
      })
      .load('school')
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
      await loadTutoratProfile(profile)
      break
    default:
      break
  }
}

export const profileSerialize: CherryPick = {
  fields: [
    'user_id',
    'avatar_url',
    'last_name',
    'first_name',
    'graduation_year',
    'current_role',
    'mobile',
    'url_facebook',
    'url_instagram',
    'url_twitter',
  ],
  relations: {
    user: {
      fields: ['email'],
    },
    school: {
      fields: ['name'],
    },
  },
}

export const profileCardSerialize: CherryPick = {
  fields: {
    pick: ['user_id', 'avatar_url', 'last_name', 'first_name', 'current_role'],
  },
  relations: {},
}

export const insameeProfileSerialize: CherryPick = {
  fields: ['text'],
  relations: {
    skills: {
      fields: ['name'],
    },
    focus_interests: {
      fields: ['name'],
    },
    associations: {
      fields: ['name', 'image_url'],
      relations: {
        school: {
          fields: ['name'],
        },
      },
    },
  },
}

export const insameeProfileCardSerialize: CherryPick = {
  fields: ['short_text'],
  relations: {
    skills: {
      fields: ['name'],
    },
    associations: {
      fields: ['name', 'image_url'],
    },
  },
}
