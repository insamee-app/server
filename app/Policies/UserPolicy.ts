import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class UserPolicy extends BasePolicy {
  public before(user: User | null) {
    if (user?.isAdmin) {
      return true
    }
  }

  public view(user: User) {
    return user.isModerator
  }

  public update(user: User, toCheckUser: User) {
    return user.id === toCheckUser.id
  }

  public updateAdmin() {
    return false
  }

  public destroy(user: User, toCheckUser: User) {
    return user.id === toCheckUser.id
  }

  public data() {
    return false
  }
}
