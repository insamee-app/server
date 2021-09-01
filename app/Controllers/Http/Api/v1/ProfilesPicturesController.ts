import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import { Populate } from 'App/Models/Profile'
import {
  getProfile,
  insameeProfileSerialize,
  populateProfile,
  profileSerialize,
} from 'App/Services/ProfileService'
import ProfilePictureValidator from 'App/Validators/ProfilePictureValidator'
import Drive from '@ioc:Adonis/Core/Drive'
import { CherryPick } from '@ioc:Adonis/Lucid/Orm'

export default class ProfilesPicturesController {
  private FOLDER = 'profiles'

  public async update({ request, params, bouncer }: HttpContextContract) {
    const { id } = params
    const profile = await getProfile(id)

    try {
      await bouncer.with('ProfilePolicy').authorize('update', profile)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { picture } = await request.validate(ProfilePictureValidator)

    const filename = profile.picture
    if (filename) await Drive.delete(`${this.FOLDER}/${filename}`)

    profile.picture = undefined

    if (picture) {
      const newFilename = `${cuid()}.${picture.extname}`
      await picture.moveToDisk(this.FOLDER, {
        name: newFilename,
      })

      profile.picture = newFilename
    }

    await profile.save()

    await populateProfile(profile, Populate.INSAMEE)

    const serialization: CherryPick = profileSerialize
    serialization.relations!.insamee_profile = insameeProfileSerialize
    return profile.serialize(serialization)
  }
}
