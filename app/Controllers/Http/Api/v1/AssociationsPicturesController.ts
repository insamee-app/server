import { cuid } from '@ioc:Adonis/Core/Helpers'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import { getAssociation } from 'App/Services/AssociationService'
import AssociationPictureValidator from 'App/Validators/AssociationPictureValidator'
import Drive from '@ioc:Adonis/Core/Drive'

export default class AssociationsPicturesController {
  private FOLDER = 'associations'

  public async update({ params, bouncer, request, auth }: HttpContextContract) {
    try {
      await bouncer.with('AssociationPolicy').authorize('update')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { id } = await params
    const { user } = await auth
    const { picture } = await request.validate(AssociationPictureValidator)

    const association = await getAssociation(id, user!.isAdmin)

    const filename = association.picture
    if (filename) await Drive.delete(`${this.FOLDER}/${filename}`)

    association.picture = null as unknown as undefined

    if (picture) {
      const newFilename = `${cuid()}.${picture.extname}`
      await picture.moveToDisk(this.FOLDER, {
        name: newFilename,
      })

      association.picture = newFilename
    }

    await association.save()

    await association.load((loader) => loader.load('school').load('thematic').load('tags'))

    return association.serialize({
      fields: [
        'id',
        'url_picture',
        'name',
        'text',
        'email',
        'created_at',
        'updated_at',
        'deleted_at',
      ],
      relations: {
        school: {
          fields: ['name'],
        },
        tags: {
          fields: ['id', 'name'],
        },
        thematic: {
          fields: ['id', 'name'],
        },
      },
    })
  }
}
