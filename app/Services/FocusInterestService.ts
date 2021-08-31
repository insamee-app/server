import NotFoundException from 'App/Exceptions/NotFoundException'
import FocusInterest from 'App/Models/FocusInterest'

export async function getFocusInterest(id: number): Promise<FocusInterest> {
  let focusInterest: FocusInterest
  try {
    focusInterest = await FocusInterest.withTrashed().where('id', id).firstOrFail()
  } catch (error) {
    throw new NotFoundException("Centre d'intérêt introuvable")
  }

  return focusInterest
}
