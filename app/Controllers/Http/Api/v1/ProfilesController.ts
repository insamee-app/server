import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InsameeProfilesQueryValidator from 'App/Validators/InsameeProfileQueryValidator'
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
import TutoratProfileValidator from 'App/Validators/TutoratProfileValidator'
import Tutorat from 'App/Models/Tutorat'
import TutoratQueryValidator from 'App/Validators/TutoratQueryValidator'
import { CherryPick } from '@ioc:Adonis/Lucid/Orm'
import SerializationQueryValidator, {
  Serialization,
} from 'App/Validators/SerializationQueryValidator'
import { tutoratCardSerialize } from 'App/Services/TutoratService'
import Database from '@ioc:Adonis/Lucid/Database'
import PlatformQueryValidator, { Platform } from 'App/Validators/PlatformQueryValidator'
import PopulateQueryValidator from 'App/Validators/PopulateQueryValidator'
import PaginateQueryValidator from 'App/Validators/PaginateQueryValidator'

const LIMIT = 20

export default class ProfilesController {
  public async me({ auth, request }: HttpContextContract) {
    const { user } = auth

    const profile = await getProfile(user!.id)

    const { populate } = await request.validate(PopulateQueryValidator)

    await populateProfile(profile, populate)

    if (populate === Populate.INSAMEE) {
      const serialization: CherryPick = profileSerialize
      serialization.relations!.insamee_profile = insameeProfileSerialize
      return profile.serialize(serialization)
    }
    return {}
  }

  public async index({ request, bouncer }: HttpContextContract) {
    const { platform } = await request.validate(PlatformQueryValidator)
    const { populate } = await request.validate(PopulateQueryValidator)
    const { page } = await request.validate(PaginateQueryValidator)
    const { serialize } = await request.validate(SerializationQueryValidator)

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
      associations,
      platform
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
      case Populate.FULL:
        profiles.preload('insameeProfile').preload('tutoratProfile')
        break
      default:
        break
    }

    if (
      platform === Platform.INSAMEE &&
      populate === Populate.INSAMEE &&
      serialize === Serialization.CARD
    ) {
      const result = await profiles.paginate(page, LIMIT)
      const serialization: CherryPick = profileCardSerialize
      serialization.relations!.insamee_profile = insameeProfileCardSerialize
      return result.serialize(serialization)
    } else if (platform === Platform.ADMIN) {
      try {
        await bouncer.with('ProfilePolicy').authorize('viewListAdmin')
      } catch (error) {
        throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
      }
      const result = await profiles.withTrashed().paginate(page, LIMIT)
      return result
    } else {
      return []
    }
  }

  public async show({ params, bouncer, request }: HttpContextContract) {
    const { id } = params

    const profile = await getProfile(id)

    const { platform } = await request.validate(PlatformQueryValidator)
    const { populate } = await request.validate(PopulateQueryValidator)
    const { serialize } = await request.validate(SerializationQueryValidator)

    await populateProfile(profile, populate)

    if (
      platform === Platform.INSAMEE &&
      serialize === Serialization.FULL &&
      populate === Populate.INSAMEE
    ) {
      const serialization: CherryPick = profileSerialize
      serialization.relations!.insamee_profile = insameeProfileSerialize

      return profile.serialize(serialization)
    } else if (platform === Platform.ADMIN) {
      try {
        await bouncer.with('ProfilePolicy').authorize('showAdmin')
      } catch (error) {
        throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
      }

      return profile
    }

    return profile.serialize(profileSerialize)
  }

  public async update({ request, params, bouncer, auth }: HttpContextContract) {
    const { id } = params
    const { user } = auth
    const profile = await getProfile(id, user!.isAdmin)

    try {
      await bouncer.with('ProfilePolicy').authorize('update', profile)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { populate } = await request.validate(PopulateQueryValidator)
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

    const { page } = await request.validate(PaginateQueryValidator)

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

    const { page } = await request.validate(PaginateQueryValidator)

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
}
