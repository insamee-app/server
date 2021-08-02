import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import School from 'App/Models/School'
import { CurrentRole } from 'App/Models/Profile'

export default class ProfileSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const school = await School.firstOrFail()

    const profiles = [
      {
        lastName: 'Marker',
        firstName: 'Virginia',
        currentRole: CurrentRole.STUDENT,
        mobile: '3305471703',
        graduationYear: 2015,
        urlFacebook: 'https://facebook.com',
        schoolId: school.id,
      },
      {
        lastName: 'Taber',
        firstName: 'Edward',
        currentRole: CurrentRole.EMPLOYEE,
        mobile: '6188675386',
        urlFacebook: 'https://facebook.com',
        urlInstagram: 'https://instagram.com',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        lastName: 'Glover',
        firstName: 'Myrtle ',
        currentRole: CurrentRole.EMPLOYEE,
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        lastName: 'Rogers',
        firstName: 'Billy',
        currentRole: CurrentRole.EMPLOYEE,
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        lastName: 'Sanchez',
        firstName: 'Anna',
        currentRole: CurrentRole.EMPLOYEE,
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        lastName: 'Clark',
        firstName: 'Teresa',
        currentRole: CurrentRole.EMPLOYEE,
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        lastName: 'Cook',
        firstName: 'Paul',
        currentRole: CurrentRole.EMPLOYEE,
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        lastName: 'Martin',
        firstName: 'Shawn',
        currentRole: CurrentRole.EMPLOYEE,
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        lastName: 'Sullivan',
        firstName: 'Paul',
        currentRole: CurrentRole.EMPLOYEE,
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        lastName: 'Butler',
        firstName: 'Carroll',
        currentRole: CurrentRole.EMPLOYEE,
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
    ]

    const users = await User.withTrashed().exec()

    for (const user of users) {
      for (let index = 0; index < profiles.length; index++) {
        const profile = profiles[index]
        if (user.email.includes(profile.lastName.toLowerCase())) {
          await user
            .related('profile')
            .updateOrCreate(
              { userId: user.id },
              { ...profile, userId: user.id, deletedAt: user.deletedAt }
            )
        }
      }
    }
  }
}
