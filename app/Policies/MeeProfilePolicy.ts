import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import MeeProfile from 'App/Models/MeeProfile'

export default class MeeProfilePolicy extends BasePolicy {
  public before(user: User | null) {
    if (user?.isAdmin) {
      return true
    }
  }
  public async update(user: User, meeProfile: MeeProfile) {
    return user.id === meeProfile.userId || user.isModerator
  }
}
