import { unlink } from 'fs'
import { promisify } from 'util'
const unlinkAsync = promisify(unlink)
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InsameeProfilesQueryValidator from 'App/Validators/InsameeProfileQueryValidator'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import Application from '@ioc:Adonis/Core/Application'
import {
  filterProfiles,
  getInsameeProfile,
  getProfile,
  getTutoratProfile,
  insameeProfileCardSerialize,
  insameeProfileSerialize,
  populateProfile,
  preloadTutoratProfile,
  profileCardSerialize,
  profileSerialize,
} from 'App/Services/ProfileService'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import Profile, { Populate } from 'App/Models/Profile'
import InsameeProfileValidator from 'App/Validators/InsameeProfileValidator'
import ProfileValidator from 'App/Validators/ProfileValidator'
import ProfileQueryValidator from 'App/Validators/ProfileQueryValidator'
import TutoratProfileValidator from 'App/Validators/TutoratProfileValidator'
import Tutorat from 'App/Models/Tutorat'
import TutoratQueryValidator from 'App/Validators/TutoratQueryValidator'
import { CherryPick } from '@ioc:Adonis/Lucid/Orm'
import SerializationQueryValidator, {
  Serialization,
} from 'App/Validators/SerializationQueryValidator'
import { tutoratCardSerialize } from 'App/Services/TutoratService'
import Database from '@ioc:Adonis/Lucid/Database'

const LIMIT = 20

export default class ProfilesController {
  public async me({ auth, request }: HttpContextContract) {
    const { user } = auth

    const profile = await Profile.findByOrFail('userId', user!.id)

    const { populate } = await request.validate(ProfileQueryValidator)

    await populateProfile(profile, populate)

    if (populate === Populate.INSAMEE) {
      const serialization: CherryPick = profileSerialize
      serialization.relations!.insamee_profile = insameeProfileSerialize
      return profile.serialize(serialization)
    } else {
      return {}
    }
  }

  public async index({ request, bouncer }: HttpContextContract) {
    try {
      await bouncer.with('ProfilePolicy').authorize('viewList')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { serialize } = await request.validate(SerializationQueryValidator)
    const { populate, page } = await request.validate(ProfileQueryValidator)

    const { currentRole, skills, focusInterests, associations } = await request.validate(
      InsameeProfilesQueryValidator
    )

    const queryProfiles = Profile.query()

    const profiles = filterProfiles(
      queryProfiles,
      // text,
      currentRole,
      skills,
      focusInterests,
      associations
    )

    switch (populate) {
      case Populate.INSAMEE:
        profiles.preload('insameeProfile', (insameeProfilesQuery) => {
          insameeProfilesQuery.preload('skills')
          insameeProfilesQuery.preload('associations')
        })
        break
      case Populate.TUTORAT:
        preloadTutoratProfile(profiles)
        break
      default:
        break
    }

    const result = await profiles.paginate(page ?? 1, LIMIT)

    if (populate === Populate.INSAMEE && serialize === Serialization.CARD) {
      const serialization: CherryPick = profileCardSerialize
      serialization.relations!.insamee_profile = insameeProfileCardSerialize
      return result.serialize(serialization)
    } else {
      return []
    }
  }

  public async show({ params, bouncer, request }: HttpContextContract) {
    const id = params.id as number

    const profile = await getProfile(id)

    try {
      await bouncer.with('ProfilePolicy').authorize('view')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { populate } = await request.validate(ProfileQueryValidator)

    await populateProfile(profile, populate)

    if (populate === Populate.INSAMEE) {
      const serialization: CherryPick = profileSerialize
      serialization.relations!.insamee_profile = insameeProfileSerialize

      return profile.serialize(serialization)
    }

    return profile.serialize(profileSerialize)
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
    const { ...data } = await request.validate(ProfileValidator)

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

    const { page } = await request.validate(ProfileQueryValidator)

    const { type } = await request.validate(TutoratQueryValidator)

    const tutorats = Tutorat.query()
      .where('user_id', '=', id)
      .preload('subject')
      .preload('school')
      .preload('profile')

    if (type) {
      tutorats.where('type', '=', type)
    }

    const result = await tutorats.paginate(page ?? 1, LIMIT)

    return result
  }

  public async tutoratsRegistrations({ auth, request }: HttpContextContract) {
    const { user } = auth

    const { page } = await request.validate(ProfileQueryValidator)

    const tutorats = await Tutorat.query()
      .whereIn(
        'id',
        Database.from('registration_tutorat').select('tutorat_id').where('user_id', '=', user!.id)
      )
      .preload('profile')
      .preload('school')
      .preload('subject')
      .paginate(page ?? 1, 6)

    return tutorats.serialize(tutoratCardSerialize)
  }

  public async updateProfilesPictures({ request, params, bouncer }: HttpContextContract) {
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
