import { RequestContract } from '@ioc:Adonis/Core/Request'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
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

  // TODO: ajouter un préload

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
