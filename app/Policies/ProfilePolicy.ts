import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'

export default class ProfilePolicy extends BasePolicy {
  public before(user: User | null) {
    if (user?.isAdmin) {
      return true
    }
  }

  public viewMeAdmin(user: User) {
    return user.isAdmin || user.isModerator
  }

  public viewListAdmin(user: User) {
    return user.isModerator
  }

  public showAdmin(user: User) {
    return user.isModerator
  }

  public update(user: User, profile: Profile) {
    return user.id === profile.userId || user.isModerator
  }
}
