import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'

export default class ProfilePolicy extends BasePolicy {
  public async before(user: User | null) {
    if (user?.isAdmin) {
      return true
    }
  }

  public async viewListAdmin() {
    return false
  }

  public showAdmin() {
    return false
  }

  public async update(user: User, profile: Profile) {
    return user.id === profile.userId
  }
}
