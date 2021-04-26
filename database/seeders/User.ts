import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const uniqueKey = 'email'

    await User.updateOrCreateMany(uniqueKey, [
      {
        email: 'VirginiaBMarker@insa-cvl.fr',
        password: 'ronaeT2Iu',
        lastName: 'Marker',
        firstName: 'Virginia',
        text: "Hello, I'm just a seed",
        mobile: '3305471703',
        skills: ['coordinating'],
        focusInterest: ['Extruding', 'forming', 'pressing', 'compacting machine setter'],
        graduationYear: 2015,
        socialNetworks: {},
      },
      {
        email: 'EdwardMTaber@insa-cvl.fr',
        password: 'Si2yuiPh',
        lastName: 'Taber',
        firstName: 'Edward',
        text: "Hello, I'm just another seed",
        mobile: '6188675386',
        skills: ['coaching', 'motivation'],
        focusInterest: ['Head cook'],
        graduationYear: 2020,
        socialNetworks: {
          facebook: 'https://facebook.com/edwardtaber',
        },
      },
    ])
  }
}
