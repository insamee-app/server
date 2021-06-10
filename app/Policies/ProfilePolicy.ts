import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'

export default class ProfilePolicy extends BasePolicy {
  public async viewList(user: User) {
    return true
  }
  public async view(user: User, profile: Profile) {
    return true
  }
  public async update(user: User, profile: Profile) {
    return user.id === profile.user_id
  }
}
