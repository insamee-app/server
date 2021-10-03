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
import { Platform } from 'App/Validators/PlatformQueryValidator'

/**
 * Get a profile by id
 * @throws {NotFoundException} Will throw an error if a profile is not found
 */
export async function getProfile(id: number, isAdmin: boolean = false): Promise<Profile> {
  let profile: Profile
  try {
    const profileQuery = Profile.query().where('user_id', '=', id)
    // Admins can get a trashed profile
    if (isAdmin) profileQuery.withTrashed()
    // Non-admins can only get a verified profile
    else
      profileQuery.whereExists((query) => {
        query
          .from('users')
          .whereColumn('users.id', 'profiles.user_id')
          .where('users.is_verified', true)
      })

    profile = await profileQuery.firstOrFail()
  } catch (error) {
    throw new NotFoundException('Utilisateur introuvable')
  }

  return profile
}

/**
 * Get an insamee profile by id
 * @throws {NotFoundException} Will throw an error if a profile is not found
 */
export async function getInsameeProfile(
  id: number,
  isAdmin: boolean = false
): Promise<InsameeProfile> {
  let insameeProfile: InsameeProfile
  try {
    const insameeProfileQuery = InsameeProfile.query().where('user_id', '=', id)
    // Admins can get a trashed profile
    if (isAdmin) insameeProfileQuery.withTrashed()
    // Non-admins can only get a verified profile
    else
      insameeProfileQuery.whereExists((query) => {
        query
          .from('users')
          .whereColumn('users.id', 'insamee_profiles.user_id')
          .where('users.is_verified', true)
      })

    insameeProfile = await insameeProfileQuery.firstOrFail()
  } catch (error) {
    throw new NotFoundException('Utilisateur introuvable')
  }
  return insameeProfile
}

/**
 * Get a tutorat profile by id
 * @throws {NotFoundException} Will throw an error if a profile is not found
 */
export async function getTutoratProfile(
  id: number,
  isAdmin: boolean = false
): Promise<TutoratProfile> {
  let tutoratProfile: TutoratProfile
  try {
    const tutoratProfileQuery = TutoratProfile.query().where('user_id', '=', id)
    // Admins can get trashed a tutorat profile
    if (isAdmin) tutoratProfileQuery.withTrashed()
    // Non-admins can only get a verified tutorat profile
    else
      tutoratProfileQuery.whereExists((query) => {
        query
          .from('users')
          .whereColumn('users.id', 'tutorat_profiles.user_id')
          .where('users.is_verified', true)
      })

    tutoratProfile = await tutoratProfileQuery.firstOrFail()
  } catch (error) {
    throw new NotFoundException('Utilisateur introuvable')
  }

  return tutoratProfile
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
  associations: number[] | undefined,
  platform: Platform
): ModelQueryBuilderContract<typeof Profile, Profile> {
  if (platform !== Platform.ADMIN) {
    profiles.whereExists((query) => {
      query
        .from('users')
        .whereColumn('users.id', 'profiles.user_id')
        .where('users.is_verified', true)
    })
  }

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
        insameeProfile.withTrashed() // TODO: check for an issue (set admin platform with full)
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
        tutoratProfile.withTrashed() // TODO: check for an issue (set admin platform with full)
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
    case Populate.FULL:
      await profile.load((loader) => {
        loader
          .load('tutoratProfile', (query) => {
            query.preload('difficultiesSubjects')
            query.preload('preferredSubjects')
            // Possible to use withTrashed because full is only for admin
            query.withTrashed()
          })
          .load('insameeProfile', (query) => {
            query.preload('skills')
            query.preload('focusInterests')
            query.preload('associations')
            // Possible to use withTrashed because full is only for admin
            query.withTrashed()
          })
      })
      break
    default:
      break
  }
}

export const profileSerialize: CherryPick = {
  fields: [
    'user_id',
    'url_picture',
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
      fields: ['email', 'email_interested_tutorat'],
    },
    school: {
      fields: ['id', 'name'],
    },
  },
}

export const profileCardSerialize: CherryPick = {
  fields: {
    pick: ['user_id', 'url_picture', 'last_name', 'first_name', 'current_role'],
  },
  relations: {},
}

export const insameeProfileSerialize: CherryPick = {
  fields: ['text'],
  relations: {
    skills: {
      fields: ['id', 'name'],
    },
    focus_interests: {
      fields: ['id', 'name'],
    },
    associations: {
      fields: ['id', 'name', 'url_picture'],
      relations: {
        school: {
          fields: ['name'],
        },
      },
    },
  },
}

export const tutoratProfileSerialize: CherryPick = {
  fields: ['text'],
  relations: {
    preferred_subjects: {
      fields: ['id', 'name'],
    },
    difficulties_subjects: {
      fields: ['id', 'name'],
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
      fields: ['name', 'url_picture'],
    },
  },
}
