import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import QueryInsameeProfilesValidator from 'App/Validators/QueryInsameeProfilesValidator'
import {
  filterInsameeProfiles,
  getInsameeProfile,
  loadInsameeProfile,
} from 'App/Services/ProfileService'
import InsameeProfile from 'App/Models/InsameeProfile'
import InsameeProfileValidator from 'App/Validators/InsameeProfileValidator'

export default class ProfilesController {
  public async me({ auth }: HttpContextContract) {
    const { user } = auth

    const profile = await InsameeProfile.findOrFail(user!.id)

    await loadInsameeProfile(profile)

    return profile
  }

  public async index({ request }: HttpContextContract) {
    const profiles = await filterInsameeProfiles(request, QueryInsameeProfilesValidator)

    return profiles
  }

  public async show({ params }: HttpContextContract) {
    const id = params.id as number

    const profile = await getInsameeProfile(id)

    await loadInsameeProfile(profile)

    return profile
  }

  public async update({ request, params }: HttpContextContract) {
    const id = params.id as number
    const profile = await getInsameeProfile(id)

    const { associations, skills, focusInterests, ...data } = await request.validate(
      InsameeProfileValidator
    )

    /*
     * Update Profile
     */
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key]
        profile[key] = element || null
      }
    }

    if (associations) await profile.related('associations').sync(associations)
    if (skills) await profile.related('skills').sync(skills)
    if (focusInterests) await profile.related('focusInterests').sync(focusInterests)

    const updatedProfile = await profile.save()

    await loadInsameeProfile(updatedProfile)

    return updatedProfile
  }
}
