import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const uniqueKey = 'email'
    const password = 'azerty'

    await User.updateOrCreateMany(uniqueKey, [
      {
        email: 'VirginiaBMarker@insa-cvl.fr'.toLowerCase(),
        isVerified: true,
        password,
      },
      {
        email: 'EdwardMTaber@insa-cvl.fr'.toLowerCase(),
        isVerified: true,
        password,
      },
      {
        email: 'MyrtleDGlover@insa-cvl.fr'.toLowerCase(),
        isVerified: true,
        password,
      },
      {
        email: 'BillyRRogers@insa-cvl.fr'.toLowerCase(),
        isVerified: true,
        password,
      },
      {
        email: 'ShawnJMartin@insa-cvl.fr'.toLowerCase(),
        password,
        isVerified: true,
      },
      {
        email: 'PaulDSullivan@insa-cvl.fr'.toLowerCase(),
        isVerified: true,
        password,
      },
      {
        email: 'AnnaKSanchez@insa-cvl.fr'.toLowerCase(),
        password,
      },
      {
        email: 'TeresaDClark@insa-cvl.fr'.toLowerCase(),
        password,
      },
      {
        email: 'PaulLCook@insa-cvl.fr'.toLowerCase(),
        password,
      },
      {
        email: 'CarrollCButler@insa-cvl.fr'.toLowerCase(),
        password,
      },
    ])
  }
}
