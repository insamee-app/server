import { CherryPick, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import NotFoundException from 'App/Exceptions/NotFoundException'
import { CurrentRole } from 'App/Models/Profile'
import Tutorat, { TutoratType } from 'App/Models/Tutorat'

/**
 * Get a tutorat by id
 * @throws {NotFoundException} Will throw an error if a tutorat is not found
 */
export async function getTutorat(id: number, isAdmin: boolean = false): Promise<Tutorat> {
  let tutorat: Tutorat
  try {
    const tutoratQuery = Tutorat.query().where('id', '=', id).withCount('usersInterested')
    // Admins can get a trashed tutorat
    if (isAdmin) tutoratQuery.withTrashed()
    // Non-admins can only get a verified tutorat
    else
      tutoratQuery.whereExists((query) => {
        query
          .from('users')
          .whereColumn('users.id', 'tutorats.user_id')
          .where('users.is_verified', true)
      })

    tutorat = await tutoratQuery.firstOrFail()
  } catch (error) {
    throw new NotFoundException('Tutorat introuvable')
  }

  return tutorat
}

/**
 * Used to filter tutorats
 */
export function filterTutorats(
  tutorats: ModelQueryBuilderContract<typeof Tutorat, Tutorat>,
  currentRole: CurrentRole | undefined,
  type: TutoratType | undefined,
  subjects: Array<number> | undefined,
  schools: Array<number> | undefined,
  time: number | undefined
): ModelQueryBuilderContract<typeof Tutorat, Tutorat> {
  // Get only tutorats where user is verified (but a tutorat can't be created by an unverified user, except in dev)
  tutorats.whereExists((query) => {
    query.from('users').whereColumn('users.id', 'tutorats.user_id').where('users.is_verified', true)
  })

  tutorats
    .if(currentRole, (query) => {
      query.whereExists((query) => {
        query
          .from('profiles')
          .whereColumn('profiles.user_id', 'tutorats.user_id')
          .where('profiles.current_role', currentRole!)
      })
    })
    .if(time, (query) => {
      query.where('time', '<=', time!)
    })
    .if(type, (query) => {
      query.where('type', '=', type!)
    })
    .if(subjects, (query) => {
      query.whereIn('subject_id', subjects!)
    })
    .if(schools, (query) => {
      query.whereIn('school_id', schools!)
    })

  return tutorats
}

/**
 * Preload data for tutorat instance
 */
export async function preloadTutorat(
  tutorats: ModelQueryBuilderContract<typeof Tutorat, Tutorat>
): Promise<void> {
  await tutorats
    .preload('profile', (profileQuery) => {
      profileQuery.preload('tutoratProfile')
    })
    .preload('school')
    .preload('subject')
}

/**
 * Load data for tutorat instance
 */
export async function loadTutorat(tutorat: Tutorat): Promise<void> {
  await tutorat.load((loader) => {
    loader.load('profile', (profile) => {
      profile.preload('user')
    })
  })
  await tutorat.load('school')
  await tutorat.load('subject')
}

export const tutoratSerialize: CherryPick = {
  fields: ['type', 'text', 'time', 'siting', 'id', 'users_interested_count', 'user_id'],
  relations: {
    school: {
      fields: ['name'],
    },
    subject: {
      fields: ['name'],
    },
    profile: {
      fields: [
        'url_picture',
        'last_name',
        'first_name',
        'current_role',
        'url_facebook',
        'url_instagram',
        'url_twitter',
        'mobile',
      ],
      relations: {
        user: {
          fields: ['email'],
        },
      },
    },
  },
}

export const tutoratCardSerialize: CherryPick = {
  fields: ['type', 'short_text', 'time', 'id', 'siting', 'users_interested_count'],
  relations: {
    school: {
      fields: ['name'],
    },
    subject: {
      fields: ['name'],
    },
    profile: {
      fields: ['url_picture', 'last_name', 'first_name', 'current_role'],
    },
  },
}
