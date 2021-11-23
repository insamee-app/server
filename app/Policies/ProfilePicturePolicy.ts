import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Profile from 'App/Models/Profile'
import User from 'App/Models/User'

export default class ProfilePicturePolicy extends BasePolicy {
  public before(user: User | null) {
    if (user?.isAdmin) {
      return true
    }
  }

  public update(user: User, profile: Profile) {
    return user.id === profile.userId
  }

  public destroy(user: User, profile: Profile) {
    return user.id === profile.userId
  }
}
