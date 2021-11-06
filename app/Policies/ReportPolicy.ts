import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class ReportPolicy extends BasePolicy {
  public before(user: User | null) {
    if (user?.isAdmin) {
      return true
    }
  }

  public view(user: User) {
    return user.isModerator
  }

  public destroy(user: User) {
    return user.isModerator
  }
}
