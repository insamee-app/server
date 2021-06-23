import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import TutoratProfile from 'App/Models/TutoratProfile'

export default class TutoratProfilePolicy extends BasePolicy {
  public async update(user: User, tutoratProfile: TutoratProfile) {
    return user.id === tutoratProfile.userId
  }
}
