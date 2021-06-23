import { RequestContract } from '@ioc:Adonis/Core/Request'
import { ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import NotFoundException from 'App/Exceptions/NotFoundException'
import Tutorat from 'App/Models/Tutorat'
import TutoratQueryValidator from 'App/Validators/TutoratQueryValidator'

/**
 * Get a tutorat by id
 * @throws {NotFoundException} Will thow an error if profil is not found
 */
export async function getTutorat(id: number): Promise<Tutorat> {
  let tutorat
  try {
    tutorat = await Tutorat.findOrFail(id)
  } catch (e) {
    throw new NotFoundException('Tutorat introuvable')
  }
  return tutorat
}

type TTutoratValidator = typeof TutoratQueryValidator

export async function filterTutorats(
  request: RequestContract,
  tutoratValidator: TTutoratValidator
): Promise<Tutorat[] | ModelPaginatorContract<Tutorat>> {
  const defaultQuery = {
    page: 1,
    limit: 5,
  }

  const { limit, page, currentRole, subject } = await request.validate(tutoratValidator)

  const queryTutorats = Tutorat.query()

  await preloadTutorat(queryTutorats)

  if (subject) {
    queryTutorats.where('subject_id', '=', subject)
  }

  if (currentRole)
    queryTutorats.whereExists((query) => {
      query
        .from('profiles')
        .whereColumn('profiles.user_id', 'tutorats.user_id')
        .where('profiles.current_role', currentRole)
    })

  const result =
    page || limit
      ? queryTutorats.paginate(page ?? defaultQuery.page, limit ?? defaultQuery.limit)
      : queryTutorats.exec()

  return result
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
      profile.preload('tutoratProfile')
    })
  })
  await tutorat.load('school')
  await tutorat.load('subject')
}
