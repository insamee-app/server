import { unlink } from 'fs'
import { promisify } from 'util'
const unlinkAsync = promisify(unlink)
import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import ProfileValidator from 'App/Validators/ProfileValidator'
import { Populate } from 'App/Models/Profile'
import { getProfile, populateProfile } from 'App/Services/ProfileService'

export default class ProfilesPicturesController {
  public async update({ request, params, bouncer }: HttpContextContract) {
    const id = params.id as number
    const profile = await getProfile(id)

    try {
      await bouncer.with('ProfilePolicy').authorize('update', profile)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { avatar } = await request.validate(ProfileValidator)

    if (profile.avatar) {
      await unlinkAsync(Application.makePath('../storage/uploads', profile.avatar))
    }

    if (avatar) {
      const filename = `${cuid()}.${avatar.extname}`
      profile.avatar = filename
      await avatar.move(Application.makePath('../storage/uploads'), {
        name: filename,
      })
    } else {
      profile.avatar = null as unknown as undefined
    }

    const updatedProfile = await profile.save()

    await populateProfile(updatedProfile, Populate.INSAMEE)

    return updatedProfile
  }
}
