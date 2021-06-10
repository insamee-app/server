import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const uniqueKey = 'email'

    await User.updateOrCreateMany(uniqueKey, [
      {
        email: 'VirginiaBMarker@insa-cvl.fr'.toLowerCase(),
        isVerified: true,
        password: 'ronaeT2Iu',
      },
      {
        email: 'EdwardMTaber@insa-cvl.fr'.toLowerCase(),
        isVerified: true,
        password: 'Si2yuiPh',
      },
      {
        email: 'MyrtleDGlover@insa-cvl.fr'.toLowerCase(),
        isVerified: true,
        password: 'Si2yuiPh',
      },
      {
        email: 'BillyRRogers@insa-cvl.fr'.toLowerCase(),
        isVerified: true,
        password: 'Si2yuiPh',
      },
      {
        email: 'AnnaKSanchez@insa-cvl.fr'.toLowerCase(),
        password: 'Si2yuiPh',
      },
      {
        email: 'TeresaDClark@insa-cvl.fr'.toLowerCase(),
        password: 'Si2yuiPh',
      },
      {
        email: 'PaulLCook@insa-cvl.fr'.toLowerCase(),
        password: 'Si2yuiPh',
      },
      {
        email: 'ShawnJMartin@insa-cvl.fr'.toLowerCase(),
        password: 'Si2yuiPh',
        isVerified: true,
      },
      {
        email: 'PaulDSullivan@insa-cvl.fr'.toLowerCase(),
        isVerified: true,
        password: 'Si2yuiPh',
      },
      {
        email: 'CarrollCButler@insa-cvl.fr'.toLowerCase(),
        password: 'Si2yuiPh',
      },
    ])
  }
}
