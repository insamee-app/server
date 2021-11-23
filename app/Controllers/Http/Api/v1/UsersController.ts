import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { getUser } from 'App/Services/UserService'
import { getProfile, getMeeProfile, getTutoratProfile } from 'App/Services/ProfileService'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import Tutorat from 'App/Models/Tutorat'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'
import MeeProfile from 'App/Models/MeeProfile'
import TutoratProfile from 'App/Models/TutoratProfile'
import UserValidator from 'App/Validators/UserValidator'
import UserDataValidator from 'App/Validators/UserDataValidator'
import PaginateQueryValidator from 'App/Validators/PaginateQueryValidator'
import PlatformQueryValidator, { Platform } from 'App/Validators/PlatformQueryValidator'
import UserAnonymiseValidator from 'App/Validators/UserAnonymiseValidator'

export default class UsersController {
  private LIMITE = 20

  public async index({ request, bouncer }: HttpContextContract) {
    try {
      await bouncer.with('UserPolicy').authorize('view')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { page } = await request.validate(PaginateQueryValidator)

    const users = await User.query().withTrashed().orderBy('id', 'asc').paginate(page, this.LIMITE)

    return users
  }

  public async show({ auth, params, bouncer }: HttpContextContract) {
    try {
      await bouncer.with('UserPolicy').authorize('view')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { user: authenticatedUser } = auth
    const { id } = params

    const user = await getUser(id, authenticatedUser!.isAdmin)

    return user
  }

  public async update({ auth, params, request, bouncer }: HttpContextContract) {
    const { user: authenticatedUser } = auth

    const { id } = params
    const user = await getUser(id, authenticatedUser?.isAdmin)

    try {
      await bouncer.with('UserPolicy').authorize('update', user)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { platform } = await request.validate(PlatformQueryValidator)
    const { isVerified, isBlocked, isAdmin, isModerator, isEventCreator, emailInterestedTutorat } =
      await request.validate(UserValidator)

    if (await bouncer.with('UserPolicy').allows('updateAdmin')) {
      user.merge({ isVerified, isBlocked, isAdmin, isModerator, isEventCreator })
    }

    user.merge({ emailInterestedTutorat })

    await user.save()

    if (platform === Platform.ADMIN && (await bouncer.with('UserPolicy').allows('updateAdmin'))) {
      return user
    }

    return user.serialize({
      fields: ['email', 'email_interested_tutorat'],
    })
  }

  public async destroy({ auth, params, bouncer }: HttpContextContract) {
    const { user: authenticatedUser } = auth
    const { id } = params

    const user = await getUser(id, authenticatedUser!.isAdmin)

    try {
      await bouncer.with('UserPolicy').authorize('destroy', user)
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const profile = await getProfile(id, authenticatedUser!.isAdmin)
    const meeProfile = await getMeeProfile(id, authenticatedUser!.isAdmin)
    const tutoratProfile = await getTutoratProfile(id, authenticatedUser!.isAdmin)
    // const associationsReports = await AssociationsReport.query().where('user_id', id).exec()
    // const tutoratsReports = await TutoratsReport.query().where('user_id', id).exec()
    const tutorats = await Tutorat.query().where('user_id', id).exec()

    for (const tutorat of tutorats) {
      await tutorat.delete()
    }
    // for (const report of associationsReports) {
    //   await report.delete()
    // }
    // for (const report of tutoratsReports) {
    //   await report.delete()
    // }
    await meeProfile.delete()
    await tutoratProfile.delete()
    await profile.delete()
    await user.delete()

    return {
      destroy: 'ok',
    }
  }

  // To anonymise, the user must be soft deleted
  public async anonymise({ bouncer, request }: HttpContextContract) {
    try {
      await bouncer.with('UserPolicy').authorize('anonymize')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { email } = await request.validate(UserAnonymiseValidator)

    const user = await User.query().where('email', email).withTrashed().firstOrFail()
    const profile = await Profile.query().where('user_id', user!.id).withTrashed().firstOrFail()
    const meeProfile = await MeeProfile.query()
      .where('user_id', user!.id)
      .withTrashed()
      .firstOrFail()
    const tutoratProfile = await TutoratProfile.query()
      .where('user_id', user!.id)
      .withTrashed()
      .firstOrFail()

    const anonymizedWord = `anonymized_${user.id}`

    // TODO: user, anonymiser l'email, mettre l'ensemble des informations autres à false
    // TODO: profile, supprimer le nom, le prénom, l'image, l'année de graduation, les urls, le rôle et le mobile

    meeProfile.text = null as unknown as undefined
    await meeProfile.save()
    await meeProfile.related('associations').detach()
    await meeProfile.related('skills').detach()
    await meeProfile.related('focusInterests').detach()

    tutoratProfile.text = null as unknown as undefined
    await tutoratProfile.save()
    await tutoratProfile.related('difficultiesSubjects').detach()
    await tutoratProfile.related('preferredSubjects').detach()
    // TODO: supprimer le texte des tutorats
    // TODO: il faut ajouter une procédure pour modifier les controllers destroy et anonymize et savoir tout ce qu'il y a à faire, comme pour les events

    return {
      anonymized: 'ok',
    }
  }

  public async data({ bouncer, request }: HttpContextContract) {
    try {
      await bouncer.with('UserPolicy').authorize('data')
    } catch (error) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette ressource')
    }

    const { email } = await request.validate(UserDataValidator)

    const user = await User.query()
      .where('email', '=', email)
      .preload('profile', (profileQuery) => {
        profileQuery
          .preload('meeProfile', (meeProfileQuery) => {
            meeProfileQuery.preload('skills').preload('focusInterests').preload('associations')
          })
          .preload('tutoratProfile', (tutoratProfileQuery) => {
            tutoratProfileQuery.preload('preferredSubjects').preload('difficultiesSubjects')
          })
          .preload('school')
      })
      .preload('tutoratsInterested', (tutoratsInterestedQuery) => {
        tutoratsInterestedQuery.withTrashed().preload('subject').preload('school')
      })
      .preload('tutoratsCreated', (tutoratsCreatedQuery) => {
        tutoratsCreatedQuery.withTrashed().preload('subject').preload('school')
      })
      .preload('reportedProfiles', (reportedProfilesQuery) => {
        reportedProfilesQuery.withTrashed().preload('reason')
      })
      .preload('reportedAssociations', (reportedAssociationsQuery) => {
        reportedAssociationsQuery.withTrashed().preload('reason')
      })
      .preload('reportedTutorats', (reportedTutoratsQuery) => {
        reportedTutoratsQuery.withTrashed().preload('reason')
      })
      .withTrashed()
      .first()

    return user!.serialize({
      relations: {
        profile: {
          relations: {
            mee_profile: {
              relations: {
                associations: { fields: ['name'] },
                skills: { fields: ['name'] },
                focus_interests: { fields: ['name'] },
              },
            },
            tutorat_profile: {
              relations: {
                difficulties_subjects: { fields: ['name'] },
                preferred_subjects: { fields: ['name'] },
              },
            },
            school: {
              fields: ['name'],
            },
          },
        },
        tutorat_interested: {
          fields: {
            omit: ['id', 'subject_id', 'school_id'],
          },
          relations: {
            school: {
              fields: ['name'],
            },
            subject: {
              fields: ['name'],
            },
          },
        },
        tutorats_created: {
          fields: {
            omit: ['id', 'subject_id', 'school_id'],
          },
          relations: {
            school: {
              fields: ['name'],
            },
            subject: {
              fields: ['name'],
            },
          },
        },
        reported_profiles: {
          fields: ['reason', 'description'],
          relations: {
            reason: {
              fields: ['name'],
            },
          },
        },
        reported_associations: {
          fields: ['reason', 'description'],
          relations: {
            reason: {
              fields: ['name'],
            },
          },
        },
        reported_tutorats: {
          fields: ['reason', 'description'],
          relations: {
            reason: {
              fields: ['name'],
            },
          },
        },
      },
    })
  }
}
