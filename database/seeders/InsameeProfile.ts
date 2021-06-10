import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import School from 'App/Models/School'
import { CurrentRole } from 'App/Models/InsameeProfile'
import User from 'App/Models/User'

export default class InsameeProfileSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const school = await School.first()

    if (!school) throw new Error('A school is missing')

    const profiles = [
      {
        lastName: 'Marker',
        firstName: 'Virginia',
        currentRole: CurrentRole.STUDENT,
        text: "Hello, I'm just a seed",
        mobile: '3305471703',
        graduationYear: 2015,
        urlFacebook: 'https://facebook.com',
        schoolId: school.id,
      },
      {
        lastName: 'Taber',
        firstName: 'Edward',
        currentRole: CurrentRole.EMPLOYEE,
        text: "Hello, I'm just another seed",
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
        text: "Hello, I'm just another seed",
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        lastName: 'Rogers',
        firstName: 'Billy',
        currentRole: CurrentRole.EMPLOYEE,
        text: "Hello, I'm just another seed",
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        lastName: 'Sanchez',
        firstName: 'Anna',
        currentRole: CurrentRole.EMPLOYEE,
        text: "Hello, I'm just another seed",
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        lastName: 'Clark',
        firstName: 'Teresa',
        currentRole: CurrentRole.EMPLOYEE,
        text: "Hello, I'm just another seed",
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        lastName: 'Cook',
        firstName: 'Paul',
        currentRole: CurrentRole.EMPLOYEE,
        text: "Hello, I'm just another seed",
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        lastName: 'Martin',
        firstName: 'Shawn',
        currentRole: CurrentRole.EMPLOYEE,
        text: "Hello, I'm just another seed",
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        lastName: 'Sullivan',
        firstName: 'Paul',
        currentRole: CurrentRole.EMPLOYEE,
        text: "Hello, I'm just another seed",
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        lastName: 'Butler',
        firstName: 'Carroll',
        currentRole: CurrentRole.EMPLOYEE,
        text: "Hello, I'm just another seed",
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
    ]

    const users = await User.all()

    for (const [index, user] of users.entries()) {
      await user.related('insameeProfile').updateOrCreate({ userId: user.id }, profiles[index])
    }
  }
}
