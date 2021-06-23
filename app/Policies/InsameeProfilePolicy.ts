import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import InsameeProfile from 'App/Models/InsameeProfile'

export default class InsameeProfilePolicy extends BasePolicy {
  public async update(user: User, insameeProfile: InsameeProfile) {
    return user.id === insameeProfile.userId
  }
}
