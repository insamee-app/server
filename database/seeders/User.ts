import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class UserSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const uniqueKey = 'email'
    const password = 'azerty'

    const datetime = DateTime.now()

    await User.updateOrCreateMany(uniqueKey, [
      {
        email: 'VirginiaBMarker@ecole.fr'.toLowerCase(),
        isVerified: true,
        password,
      },
      {
        email: 'EdwardMTaber@ecole.fr'.toLowerCase(),
        isVerified: true,
        password,
      },
      {
        email: 'MyrtleDGlover@ecole.fr'.toLowerCase(),
        isVerified: true,
        password,
      },
      {
        email: 'BillyRRogers@ecole.fr'.toLowerCase(),
        isVerified: true,
        password,
      },
      {
        email: 'ShawnJMartin@ecole.fr'.toLowerCase(),
        password,
        isVerified: true,
      },
      {
        email: 'PaulDSullivan@ecole.fr'.toLowerCase(),
        isVerified: true,
        deletedAt: datetime,
        password,
      },
      {
        email: 'AnnaKSanchez@ecole.fr'.toLowerCase(),
        password,
      },
      {
        email: 'TeresaDClark@ecole.fr'.toLowerCase(),
        password,
      },
      {
        email: 'PaulLCook@ecole.fr'.toLowerCase(),
        password,
      },
      {
        email: 'CarrollCButler@ecole.fr'.toLowerCase(),
        password,
      },
    ])
  }
}
