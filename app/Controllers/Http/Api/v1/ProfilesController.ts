import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InsameeProfilesQueryValidator from 'App/Validators/InsameeProfileQueryValidator'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import Application from '@ioc:Adonis/Core/Application'
import {
  filterProfiles,
  getInsameeProfile,
  getProfile,
  getTutoratProfile,
  populateProfile,
} from 'App/Services/ProfileService'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import Profile, { Populate } from 'App/Models/Profile'
import InsameeProfileValidator from 'App/Validators/InsameeProfileValidator'
import ProfileValidator from 'App/Validators/ProfileValidator'
import ProfileQueryValidator from 'App/Validators/ProfileQueryValidator'
import TutoratProfileValidator from 'App/Validators/TutoratProfileValidator'
import Tutorat from 'App/Models/Tutorat'

export default class ProfilesController {
  public async me({ auth, request }: HttpContextContract) {
    const { user } = auth

    const profile = await Profile.findByOrFail('userId', user!.id)

    const { populate } = await request.validate(ProfileQueryValidator)

    await populateProfile(profile, populate)

    return profile
  }

  public async index({ request, bouncer }: HttpContextContract) {
    try {
      await bouncer.with('ProfilePolicy').authorize('viewList')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const profiles = await filterProfiles(
      request,
      ProfileQueryValidator,
      InsameeProfilesQueryValidator
    )

    return profiles
  }

  public async show({ params, bouncer, request }: HttpContextContract) {
    const id = params.id as number

    const profile = await getProfile(id)

    try {
      await bouncer.with('ProfilePolicy').authorize('view', profile)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { populate } = await request.validate(ProfileQueryValidator)

    await populateProfile(profile, populate)

    return profile
  }

  public async update({ request, params, bouncer }: HttpContextContract) {
    const id = params.id as number
    const profile = await getProfile(id)

    try {
      await bouncer.with('ProfilePolicy').authorize('update', profile)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { populate } = await request.validate(ProfileQueryValidator)
    const { avatar, ...data } = await request.validate(ProfileValidator)

    if (populate === Populate.INSAMEE) {
      /**
       * Update insamee profile
       */
      const {
        text: insameeText,
        skills,
        focusInterests,
        associations,
      } = await request.validate(InsameeProfileValidator)

      const insameeProfile = await getInsameeProfile(id)

      try {
        await bouncer.with('InsameeProfilePolicy').authorize('update', insameeProfile)
      } catch (error) {
        throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
      }

      insameeProfile.text = insameeText || (null as unknown as undefined)
      await insameeProfile.save()

      if (associations) await insameeProfile.related('associations').sync(associations)
      if (skills) await insameeProfile.related('skills').sync(skills)
      if (focusInterests) await insameeProfile.related('focusInterests').sync(focusInterests)
    } else if (populate === Populate.TUTORAT) {
      /**
       * Update tutorat profile
       */
      const {
        text: tutoratText,
        preferredSubjects,
        difficultiesSubjects,
      } = await request.validate(TutoratProfileValidator)

      const tutoratProfile = await getTutoratProfile(id)

      try {
        await bouncer.with('TutoratProfilePolicy').authorize('update', tutoratProfile)
      } catch (error) {
        throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
      }

      tutoratProfile.text = tutoratText || (null as unknown as undefined)
      await tutoratProfile.save()

      if (preferredSubjects)
        await tutoratProfile.related('preferredSubjects').sync(preferredSubjects)
      if (difficultiesSubjects)
        await tutoratProfile.related('difficultiesSubjects').sync(difficultiesSubjects)
    }

    /*
     * Update global profile
     */
    if (avatar) {
      const filename = `${cuid()}.${avatar.extname}`
      profile.avatar = filename
      if (Application.inProduction) {
        // TODO: send to s3 and remove the previous file
      } else {
        // in dev, not need to remove a file
        avatar.move(Application.makePath('../storage/uploads'), {
          name: filename,
          overwrite: true,
        })
      }
    }

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key]
        profile[key] = element || null
      }
    }

    const updatedProfile = await profile.save()

    await populateProfile(updatedProfile, populate)

    return updatedProfile
  }

  public async tutorats({ params, request }: HttpContextContract) {
    const { id } = params

    const { limit, page } = await request.validate(ProfileQueryValidator)

    const tutorats = await Tutorat.query()
      .where('user_id', '=', id)
      .preload('subject')
      .preload('school')
      .preload('profile')
      .paginate(page ?? 1, limit ?? 5)

    return tutorats
  }
}
