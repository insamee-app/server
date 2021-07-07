// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Tag from 'App/Models/Tag'

export default class TagsController {
  public async index() {
    const tags = await Tag.all()
    const tagsJSON = tags.map((tag) =>
      tag.serialize({
        fields: {
          pick: ['id', 'name'],
        },
      })
    )

    return tagsJSON
  }
}
