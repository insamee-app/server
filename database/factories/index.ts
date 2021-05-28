import Factory from '@ioc:Adonis/Lucid/Factory'
import School from 'App/Models/School'
import User from 'App/Models/User'

export const SchoolFactory = Factory.define(School, ({ faker }) => {
  return {
    host: faker.internet.domainName(),
    name: faker.company.companyName(),
  }
}).build()

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    email: `${faker.name.firstName()}_${faker.name.lastName()}@insa-cvl.fr`,
    password: faker.internet.password(),
    isVerified: false,
  }
})
  .relation('school', () => SchoolFactory)
  .state('verified', (user) => (user.isVerified = true))
  .build()
