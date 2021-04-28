/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.get('/', async () => {
  return { message: 'API from INSAMEE' }
})

Route.group(() => {
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
  Route.post('logout', 'AuthController.logout')
})
  .prefix('auth')
  .namespace('App/Controllers/Http/Auth')

Route.group(() => {
  Route.resource('users', 'UsersController').only(['index', 'show', 'update', 'destroy'])
  Route.get('associations', 'AssociationsController.index').as('associations.index')
  Route.get('schools', 'SchoolsController.index').as('schools.index')
  Route.get('skills', 'SkillsController.index').as('skills.index')
})
  .middleware('auth')
  .prefix('api/v1')
  .namespace('App/Controllers/Http/Api/v1')
  .as('api.v1')

// Route.get('health', async ({ response, auth }) => {
//   const user = await auth.authenticate()

//   console.log(user)

//   const report = await HealthCheck.getReport()

//   return report.healthy ? response.ok(report) : response.badRequest(report)
// }).middleware('auth')
