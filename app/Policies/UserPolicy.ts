import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class UserPolicy extends BasePolicy {
  public async before(user: User | null) {
    if (user?.isAdmin) {
      return true
    }
  }

  public async view() {
    return false
  }

  public async update() {
    return false
  }
  public async destroy(user: User, toCheckUser: User) {
    return user.id === toCheckUser.id
  }
}
