import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'

export default class ProfilePolicy extends BasePolicy {
  public async viewList() {
    return true
  }
  public async viewListAdmin(user: User) {
    return user.isAdmin
  }

  public async view() {
    return true
  }
  public async update(user: User, profile: Profile) {
    return user.id === profile.userId
  }
}
