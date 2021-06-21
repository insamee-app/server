import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class UserPolicy extends BasePolicy {
  public async update(user: User, toCheckUser: User) {
    return user.id === toCheckUser.id
  }
  public async destroy(user: User, toCheckUser: User) {
    return user.id === toCheckUser.id
  }
}
