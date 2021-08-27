import { CherryPick, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import NotFoundException from 'App/Exceptions/NotFoundException'
import { CurrentRole } from 'App/Models/Profile'
import Tutorat, { TutoratType } from 'App/Models/Tutorat'

/**
 * Get a tutorat by id
 * @throws {NotFoundException} Will thow an error if profil is not found
 */
export async function getTutorat(id: number): Promise<Tutorat> {
  const tutorat = await Tutorat.query()
    .whereExists((query) => {
      query
        .from('users')
        .whereColumn('users.id', 'tutorats.user_id')
        .where('users.is_verified', true)
    })
    .where('id', '=', id)
    .limit(1)

  if (!tutorat[0]) throw new NotFoundException('Tutorat introuvable')

  return tutorat[0]
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

export const tutoratCardSerialize: CherryPick = {
  fields: ['type', 'short_text', 'time', 'id'],
  relations: {
    school: {
      fields: ['name'],
    },
    subject: {
      fields: ['name'],
    },
    profile: {
      fields: ['avatar_url', 'last_name', 'first_name', 'current_role'],
    },
  },
}
