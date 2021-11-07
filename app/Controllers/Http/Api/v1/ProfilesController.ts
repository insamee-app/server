import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MeeProfilesQueryValidator from 'App/Validators/MeeProfileQueryValidator'
import {
  filterProfiles,
  getMeeProfile,
  getProfile,
  getTutoratProfile,
  meeProfileCardSerialize,
  meeProfileSerialize,
  tutoratProfileSerialize,
  populateProfile,
  preloadTutoratProfile,
  profileCardSerialize,
  profileSerialize,
  profileMeSerialize,
} from 'App/Services/ProfileService'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import Profile, { Populate } from 'App/Models/Profile'
import MeeProfileValidator from 'App/Validators/MeeProfileValidator'
import ProfileValidator from 'App/Validators/ProfileValidator'
import TutoratProfileValidator from 'App/Validators/TutoratProfileValidator'
import Tutorat from 'App/Models/Tutorat'
import TutoratQueryValidator from 'App/Validators/TutoratQueryValidator'
import { CherryPick } from '@ioc:Adonis/Lucid/Orm'
import SerializationQueryValidator, {
  Serialization,
} from 'App/Validators/SerializationQueryValidator'
import { filterTutorats, tutoratCardSerialize } from 'App/Services/TutoratService'
import Database from '@ioc:Adonis/Lucid/Database'
import PlatformQueryValidator, { Platform } from 'App/Validators/PlatformQueryValidator'
import PopulateQueryValidator from 'App/Validators/PopulateQueryValidator'
import PaginateQueryValidator from 'App/Validators/PaginateQueryValidator'

const LIMIT = 20

export default class ProfilesController {
  public async me({ auth, request, bouncer }: HttpContextContract) {
    const { user } = auth

    const profile = await getProfile(user!.id)

    const { populate } = await request.validate(PopulateQueryValidator)

    await populateProfile(profile, populate)

    if (populate === Populate.MEE) {
      const serialization: CherryPick = profileMeSerialize
      serialization.relations!.mee_profile = meeProfileSerialize
      return profile.serialize(serialization)
    } else if (populate === Populate.TUTORAT) {
      const serialization: CherryPick = profileMeSerialize
      serialization.relations!.tutorat_profile = tutoratProfileSerialize
      return profile.serialize(serialization)
    } else if (
      populate === Populate.ADMIN &&
      (await bouncer.with('ProfilePolicy').allows('viewMeAdmin'))
    ) {
      return profile.serialize({
        fields: [],
        relations: {
          user: {
            fields: ['is_admin', 'is_moderator'],
          },
        },
      })
    }
    return {}
  }

  public async index({ request, bouncer }: HttpContextContract) {
    const { platform } = await request.validate(PlatformQueryValidator)
    const { populate } = await request.validate(PopulateQueryValidator)
    const { page } = await request.validate(PaginateQueryValidator)
    const { serialize } = await request.validate(SerializationQueryValidator)

    const { currentRole, skills, focusInterests, associations } = await request.validate(
      MeeProfilesQueryValidator
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
      case Populate.MEE:
        profiles.preload('meeProfile', (meeProfilesQuery) => {
          meeProfilesQuery.preload('skills')
          meeProfilesQuery.preload('associations')
        })
        break
      case Populate.TUTORAT:
        preloadTutoratProfile(profiles)
        break
      case Populate.FULL:
        profiles.preload('meeProfile').preload('tutoratProfile')
        break
      default:
        break
    }

    if (
      platform === Platform.MEE &&
      populate === Populate.MEE &&
      serialize === Serialization.CARD
    ) {
      const result = await profiles.paginate(page, LIMIT)
      const serialization: CherryPick = profileCardSerialize
      serialization.relations!.mee_profile = meeProfileCardSerialize
      return result.serialize(serialization)
    } else if (
      platform === Platform.ADMIN &&
      (await bouncer.with('ProfilePolicy').allows('viewListAdmin'))
    ) {
      const result = await profiles.withTrashed().paginate(page, LIMIT)
      return result.serialize({
        fields: {
          omit: ['picture'],
        },
      })
    } else {
      return []
    }
  }

  public async show({ params, bouncer, request, auth }: HttpContextContract) {
    const { id } = params
    const { user } = auth

    const profile = await getProfile(id, user!.isAdmin)

    const { platform } = await request.validate(PlatformQueryValidator)
    const { populate } = await request.validate(PopulateQueryValidator)
    const { serialize } = await request.validate(SerializationQueryValidator)

    await populateProfile(profile, populate)

    if (
      (platform === Platform.MEE || platform === Platform.ASSOCIATIONS) &&
      serialize === Serialization.FULL &&
      populate === Populate.MEE
    ) {
      const serialization: CherryPick = profileSerialize
      serialization.relations!.mee_profile = meeProfileSerialize

      return profile.serialize(serialization)
    } else if (
      platform === Platform.TUTORAT &&
      serialize === Serialization.FULL &&
      populate === Populate.TUTORAT
    ) {
      const serialization: CherryPick = profileSerialize
      serialization.relations!.tutorat_profile = tutoratProfileSerialize

      return profile.serialize(serialization)
    } else if (
      platform === Platform.ADMIN &&
      (await bouncer.with('ProfilePolicy').allows('showAdmin'))
    ) {
      return profile
    } else {
      return {}
    }
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
    const { platform } = await request.validate(PlatformQueryValidator)
    const { ...data } = await request.validate(ProfileValidator)

    if (populate === Populate.MEE) {
      /**
       * Update mee profile
       */
      const {
        text: meeText,
        skills,
        focusInterests,
        associations,
      } = await request.validate(MeeProfileValidator)

      const meeProfile = await getMeeProfile(id, user!.isAdmin)

      try {
        await bouncer.with('MeeProfilePolicy').authorize('update', meeProfile)
      } catch (error) {
        throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
      }

      meeProfile.text = meeText || (null as unknown as undefined)
      await meeProfile.save()

      if (associations) await meeProfile.related('associations').sync(associations)
      if (skills) await meeProfile.related('skills').sync(skills)
      if (focusInterests) await meeProfile.related('focusInterests').sync(focusInterests)
    } else if (populate === Populate.TUTORAT) {
      /**
       * Update tutorat profile
       */
      const {
        text: tutoratText,
        preferredSubjects,
        difficultiesSubjects,
      } = await request.validate(TutoratProfileValidator)

      const tutoratProfile = await getTutoratProfile(id, user!.isAdmin)

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

    if (platform === Platform.ADMIN && (await bouncer.with('ProfilePolicy').allows('showAdmin'))) {
      return updatedProfile
    } else if (populate === Populate.MEE) {
      const serialization: CherryPick = profileMeSerialize
      serialization.relations!.mee_profile = meeProfileSerialize

      return profile.serialize(serialization)
    } else if (populate === Populate.TUTORAT) {
      const serialization: CherryPick = profileMeSerialize
      serialization.relations!.tutorat_profile = tutoratProfileSerialize

      return profile.serialize(serialization)
    }
  }

  public async tutorats({ params, request }: HttpContextContract) {
    const { id } = params

    const { page } = await request.validate(PaginateQueryValidator)

    const { subjects, currentRole, schools, type, time, siting } = await request.validate(
      TutoratQueryValidator
    )

    const queryTutorats = Tutorat.query()
      .where('user_id', '=', id)
      .preload('subject')
      .preload('school')
      .preload('profile')

    const filteredTutorats = filterTutorats(
      queryTutorats,
      currentRole,
      type,
      subjects,
      schools,
      time,
      siting
    )

    const result = await filteredTutorats.paginate(page, LIMIT)

    return result.serialize(tutoratCardSerialize)
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
      .paginate(page, 6)

    return tutorats.serialize(tutoratCardSerialize)
  }
}
