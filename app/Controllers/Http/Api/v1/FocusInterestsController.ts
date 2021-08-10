// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import FocusInterest from 'App/Models/FocusInterest'

export default class FocusInterestsController {
  public async index() {
    const focusInterests = await FocusInterest.query().orderBy('name')
    const focusInterestsJSON = focusInterests.map((focusInterest) =>
      focusInterest.serialize({
        fields: {
          pick: ['id', 'name'],
        },
      })
    )

    return focusInterestsJSON
  }
}
