import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import { Populate } from 'App/Models/Profile'
import {
  getProfile,
  meeProfileSerialize,
  populateProfile,
  profileSerialize,
} from 'App/Services/ProfileService'
import ProfilePictureValidator from 'App/Validators/ProfilePictureValidator'
import PlatformQueryValidator, { Platform } from 'App/Validators/PlatformQueryValidator'
import Drive from '@ioc:Adonis/Core/Drive'
import { CherryPick } from '@ioc:Adonis/Lucid/Orm'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'

export default class ProfilesPicturesController {
  private FOLDER = 'profiles'

  public async update({ request, params, bouncer }: HttpContextContract) {
    const { id } = params
    const profile = await getProfile(id)

    try {
      await bouncer.with('ProfilePicturePolicy').authorize('update', profile)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { picture } = await request.validate(ProfilePictureValidator)
    const { platform } = await request.validate(PlatformQueryValidator)

    profile.picture = Attachment.fromFile(picture)
    // Save to disk using attachement lite
    await profile.save()

    await populateProfile(profile, Populate.MEE)

    if (platform === Platform.ADMIN && (await bouncer.with('ProfilePolicy').allows('showAdmin'))) {
      return profile
    } else {
      const serialization: CherryPick = profileSerialize
      serialization.relations!.mee_profile = meeProfileSerialize
      return profile.serialize(serialization)
    }
  }

  public async destroy({ bouncer, params }: HttpContextContract) {
    const { id } = params
    const profile = await getProfile(id)

    try {
      await bouncer.with('ProfilePicturePolicy').authorize('destroy', profile)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { platform } = await request.validate(PlatformQueryValidator)
    profile.picture = null as unknown as undefined
    // Remove the picture from disk using attachement lite
    await profile.save()

    await populateProfile(profile, Populate.MEE)

    if (platform === Platform.ADMIN && (await bouncer.with('ProfilePolicy').allows('showAdmin'))) {
      return profile
    } else {
      const serialization: CherryPick = profileSerialize
      serialization.relations!.mee_profile = meeProfileSerialize
      return profile.serialize(serialization)
    }
  }
}
