// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Thematic from 'App/Models/Thematic'

export default class ThematicsController {
  public async index() {
    const thematics = await Thematic.all()
    const thematicsJSON = thematics.map((thematic) =>
      thematic.serialize({
        fields: {
          pick: ['id', 'name'],
        },
      })
    )

    return thematicsJSON
  }
}
