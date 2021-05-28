import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import School from 'App/Models/School'
import User, { CurrentRole } from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const uniqueKey = 'email'

    const school = await School.first()

    if (!school) throw new Error('A school is missing')

    await User.updateOrCreateMany(uniqueKey, [
      {
        email: 'VirginiaBMarker@insa-cvl.fr'.toLowerCase(),
        isVerified: true,
        password: 'ronaeT2Iu',
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
        email: 'EdwardMTaber@insa-cvl.fr'.toLowerCase(),
        isVerified: true,
        password: 'Si2yuiPh',
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
        email: 'MyrtleDGlover@insa-cvl.fr'.toLowerCase(),
        isVerified: true,
        password: 'Si2yuiPh',
        lastName: 'Glover',
        firstName: 'Myrtle ',
        currentRole: CurrentRole.EMPLOYEE,
        text: "Hello, I'm just another seed",
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        email: 'BillyRRogers@insa-cvl.fr'.toLowerCase(),
        isVerified: true,
        password: 'Si2yuiPh',
        lastName: 'Rogers',
        firstName: 'Billy',
        currentRole: CurrentRole.EMPLOYEE,
        text: "Hello, I'm just another seed",
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        email: 'AnnaKSanchez@insa-cvl.fr'.toLowerCase(),
        password: 'Si2yuiPh',
        lastName: 'Sanchez',
        firstName: 'Anna',
        currentRole: CurrentRole.EMPLOYEE,
        text: "Hello, I'm just another seed",
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        email: 'TeresaDClark@insa-cvl.fr'.toLowerCase(),
        password: 'Si2yuiPh',
        lastName: 'Clark',
        firstName: 'Teresa',
        currentRole: CurrentRole.EMPLOYEE,
        text: "Hello, I'm just another seed",
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        email: 'PaulLCook@insa-cvl.fr'.toLowerCase(),
        password: 'Si2yuiPh',
        lastName: 'Cook',
        firstName: 'Paul',
        currentRole: CurrentRole.EMPLOYEE,
        text: "Hello, I'm just another seed",
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        email: 'ShawnJMartin@insa-cvl.fr'.toLowerCase(),
        password: 'Si2yuiPh',
        lastName: 'Martin',
        firstName: 'Shawn',
        currentRole: CurrentRole.EMPLOYEE,
        text: "Hello, I'm just another seed",
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        email: 'PaulDSullivan@insa-cvl.fr'.toLowerCase(),
        isVerified: true,
        password: 'Si2yuiPh',
        lastName: 'Sullivan',
        firstName: 'Paul',
        currentRole: CurrentRole.EMPLOYEE,
        text: "Hello, I'm just another seed",
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
      {
        email: 'CarrollCButler@insa-cvl.fr'.toLowerCase(),
        password: 'Si2yuiPh',
        lastName: 'Butler',
        firstName: 'Carroll',
        currentRole: CurrentRole.EMPLOYEE,
        text: "Hello, I'm just another seed",
        mobile: '6188675386',
        graduationYear: 2020,
        schoolId: school.id,
      },
    ])
  }
}
