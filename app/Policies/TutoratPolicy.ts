import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Tutorat, { TutoratType } from 'App/Models/Tutorat'

export default class TutoratPolicy extends BasePolicy {
  public before(user: User | null) {
    if (user?.isAdmin) {
      return true
    }
  }

  public viewListAdmin(user: User) {
    return user.isModerator
  }

  public viewProfilesList(user: User, tutorat: Tutorat) {
    return user.id === tutorat.userId && tutorat.type === TutoratType.OFFER
  }

  public showAdmin(user: User) {
    return user.isModerator
  }

  public update(user: User, tutorat: Tutorat) {
    return user.id === tutorat.userId || user.isModerator
  }

  public delete(user: User, tutorat: Tutorat) {
    return user.id === tutorat.userId || user.isModerator
  }

  public restore() {
    return false
  }
}
