import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class SkillPolicy extends BasePolicy {
  public async before(user: User | null) {
    if (user?.isAdmin) {
      return true
    }
  }

  public async view() {
    return true
  }

  public async viewAdmin(user: User) {
    return user.isAdmin
  }

  public async store() {
    return false
  }

  public async update() {
    return false
  }

  public async destroy() {
    return false
  }

  public async restore() {
    return false
  }
}
