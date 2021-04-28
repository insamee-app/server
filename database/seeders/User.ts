import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import School from 'App/Models/School'
import User, { currentRole } from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const uniqueKey = 'email'

    const school = await School.first()

    if (!school) throw new Error('A school is missing')

    await User.updateOrCreateMany(uniqueKey, [
      {
        email: 'VirginiaBMarker@insa-cvl.fr',
        password: 'ronaeT2Iu',
        lastName: 'Marker',
        firstName: 'Virginia',
        currentRole: currentRole.STUDENT,
        text: "Hello, I'm just a seed",
        mobile: '3305471703',
        focusInterest: ['Extruding', 'forming', 'pressing', 'compacting machine setter'],
        graduationYear: 2015,
        socialNetworks: {},
        schoolId: school.id,
      },
      {
        email: 'EdwardMTaber@insa-cvl.fr',
        password: 'Si2yuiPh',
        lastName: 'Taber',
        firstName: 'Edward',
        currentRole: currentRole.EMPLOYEE,
        text: "Hello, I'm just another seed",
        mobile: '6188675386',
        focusInterest: ['Head cook'],
        graduationYear: 2020,
        socialNetworks: {
          facebook: 'https://facebook.com/edwardtaber',
        },
        schoolId: school.id,
      },
    ])
  }
}
