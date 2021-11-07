import { ModelObject, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import NotFoundException from 'App/Exceptions/NotFoundException'
import AssociationsReport from 'App/Models/AssociationsReport'
import ProfilesReport from 'App/Models/ProfilesReport'
import TutoratsReport from 'App/Models/TutoratsReport'

export enum Resource {
  PROFILES = 'profiles',
  TUTORATS = 'tutorats',
  ASSOCIATIONS = 'associations',
}

export type Report = ProfilesReport | TutoratsReport | AssociationsReport

export type ModelQueryBuilderReports = ModelQueryBuilderContract<
  typeof ProfilesReport | typeof TutoratsReport | typeof AssociationsReport,
  Report
>

export async function getReport(query: ModelQueryBuilderReports, id: number): Promise<Report> {
  let report: Report
  try {
    report = await query.withTrashed().where('id', id).firstOrFail()
  } catch (error) {
    throw new NotFoundException('Signalement introuvable')
  }
  return report
}

export function query(resource: Resource): ModelQueryBuilderReports {
  let query: ModelQueryBuilderReports
  switch (resource) {
    case Resource.PROFILES:
      query = ProfilesReport.query()
      break
    case Resource.TUTORATS:
      query = TutoratsReport.query()
      break
    case Resource.ASSOCIATIONS:
      query = AssociationsReport.query()
      break
    default:
      throw new Error(`Resource ${resource} not found`)
  }
  return query
}

export function preload(query: ModelQueryBuilderReports, resource: Resource): void {
  switch (resource) {
    case Resource.PROFILES:
      ;(query as unknown as ModelQueryBuilderContract<typeof ProfilesReport, ProfilesReport>)
        .preload('profileUser', (query) => query.withTrashed())
        .preload('user', (query) => query.withTrashed())
        .preload('reason')
      break
    case Resource.TUTORATS:
      ;(query as unknown as ModelQueryBuilderContract<typeof TutoratsReport, TutoratsReport>)
        .preload('tutorat', (query) => query.withTrashed().preload('user'))
        .preload('user', (query) => query.withTrashed())
        .preload('reason')
      break
    case Resource.ASSOCIATIONS:
      ;(
        query as unknown as ModelQueryBuilderContract<typeof AssociationsReport, AssociationsReport>
      )
        .preload('association', (query) => query.withTrashed())
        .preload('user', (query) => query.withTrashed())
        .preload('reason')
      break
    default:
      throw new Error(`Resource ${resource} not found`)
  }
}

export async function load(report: Report, resource: Resource): Promise<void> {
  switch (resource) {
    case Resource.PROFILES:
      await (report as unknown as ProfilesReport).load((loader) => {
        loader
          .load('profileUser', (query) =>
            query.withTrashed().preload('profile', (profile) =>
              profile
                .preload('meeProfile', (meeProfile) => {
                  meeProfile.preload('associations').preload('skills').preload('focusInterests')
                })
                .preload('tutoratProfile', (tutoratProfile) => {
                  tutoratProfile.preload('difficultiesSubjects').preload('preferredSubjects')
                })
            )
          )
          .load('user', (query) => query.withTrashed())
          .load('reason')
      })
      break
    case Resource.TUTORATS:
      await (report as unknown as TutoratsReport).load((loader) => {
        loader
          .load('tutorat', (query) =>
            query
              .withTrashed()
              .preload('user')
              .preload('school')
              .preload('subject')
              .preload('profile')
          )
          .load('user', (query) => query.withTrashed())
          .load('reason')
      })
      break
    case Resource.ASSOCIATIONS:
      await (report as unknown as AssociationsReport).load((loader) => {
        loader
          .load('association', (query) =>
            query.withTrashed().preload('school').preload('tags').preload('thematic')
          )
          .load('user', (query) => query.withTrashed())
          .load('reason')
      })
      break
    default:
      throw new Error(`Resource ${resource} not found`)
  }
}

export function serializeReport(report: Report, resource: Resource) {
  let serializedReport: ModelObject

  switch (resource) {
    case Resource.PROFILES:
      serializedReport = report.serialize({
        fields: ['id', 'description', 'created_at', 'updated_at', 'deleted_at'],
        relations: {
          profile_user: {
            fields: ['id', 'email', 'created_at', 'updated_at', 'deleted_at'],
            relations: {
              profile: {
                fields: [
                  'user_id',
                  'first_name',
                  'last_name',
                  'url_facebook',
                  'url_instagram',
                  'url_twitter',
                  'mobile',
                  'url_picture',
                  'current_role',
                  'graduation_year',
                  'created_at',
                  'updated_at',
                  'deleted_at',
                ],
                relations: {
                  mee_profile: {
                    fields: ['text'],
                    relations: {
                      associations: {
                        fields: ['name'],
                      },
                      skills: {
                        fields: ['name'],
                      },
                      focus_interests: {
                        fields: ['name'],
                      },
                    },
                  },
                  tutorat_profile: {
                    fields: ['text'],
                    relations: {
                      difficulties_subjects: {
                        fields: ['name'],
                      },
                      preferred_subjects: {
                        fields: ['name'],
                      },
                    },
                  },
                },
              },
            },
          },
          user: {
            fields: ['email', 'created_at', 'updated_at', 'deleted_at'],
          },
          reason: {
            fields: ['name'],
          },
        },
      })

      break
    case Resource.TUTORATS:
      serializedReport = report.serialize({
        fields: ['id', 'description', 'created_at', 'updated_at', 'deleted_at'],
        relations: {
          tutorat: {
            fields: [
              'id',
              'text',
              'type',
              'time',
              'siting',
              'created_at',
              'updated_at',
              'deleted_at',
            ],
            relations: {
              school: {
                fields: ['name'],
              },
              subject: {
                fields: ['name'],
              },
              profile: {
                fields: ['first_name', 'last_name'],
              },
            },
          },
          user: {
            fields: ['email', 'created_at', 'updated_at', 'deleted_at'],
          },
          reason: {
            fields: ['name'],
          },
        },
      })
      break
    case Resource.ASSOCIATIONS:
      serializedReport = report.serialize({
        fields: ['id', 'description', 'created_at', 'updated_at', 'deleted_at'],
        relations: {
          association: {
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
          },
          user: {
            fields: ['email', 'created_at', 'updated_at', 'deleted_at'],
          },
          reason: {
            fields: ['name'],
          },
        },
      })
      break
    default:
      throw new Error(`Resource ${resource} not found`)
  }

  return serializedReport
}
