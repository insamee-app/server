import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Tutorat, { TutoratType } from 'App/Models/Tutorat'

export default class TutoratPolicy extends BasePolicy {
  public before(user: User | null) {
    if (user?.isAdmin) {
      return true
    }
  }

  public viewListAdmin() {
    return false
  }

  public viewProfilesList(user: User, tutorat: Tutorat) {
    return user.id === tutorat.userId && tutorat.type === TutoratType.OFFER
  }

  public showAdmin() {
    return false
  }

  public update(user: User, tutorat: Tutorat) {
    return user.id === tutorat.userId
  }

  public delete(user: User, tutorat: Tutorat) {
    return user.id === tutorat.userId
  }

  public restore() {
    return false
  }
}
