import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class SchoolPolicy extends BasePolicy {
  public before(user: User | null) {
    if (user?.isAdmin) {
      return true
    }
  }

  public view() {
    return true
  }

  public viewAdmin(user: User) {
    return user.isModerator
  }

  public store() {
    return false
  }

  public update() {
    return false
  }

  public destroy() {
    return false
  }

  public restore() {
    return false
  }
}
