import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Tutorat from 'App/Models/Tutorat'

export default class TutoratPolicy extends BasePolicy {
  public async update(user: User, tutorat: Tutorat) {
    return user.id === tutorat.userId
  }
  public async delete(user: User, tutorat: Tutorat) {
    return user.id === tutorat.userId
  }
}
