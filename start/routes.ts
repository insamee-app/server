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
import Application from '@ioc:Adonis/Core/Application'

Route.get('/', async () => {
  return { message: 'API from INSAMEE' }
})

Route.group(() => {
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
  Route.post('logout', 'AuthController.logout')

  Route.post('verify/:email', 'AuthController.verifyEmail').as('verifyEmail')
  Route.post('resetPassword/:email', 'AuthController.resetPassword').as('resetPassword')

  Route.group(() => {
    Route.post('verifyEmail', 'AuthController.sendVerifyEmail').as('sendVerifyEmail')
    Route.post('resetPassword', 'AuthController.sendResetPassword').as('sendResetPassword')
  }).prefix('send')
})
  .prefix('auth')
  .namespace('App/Controllers/Http/Auth')

Route.group(() => {
  Route.resource('users', 'UsersController').only(['destroy'])
  Route.get('profiles/me', 'ProfilesController.me').as('profiles.me')
  Route.resource('profiles', 'ProfilesController').only(['index', 'show', 'update'])
  Route.resource('tutorats', 'TutoratsController').apiOnly()

  Route.get('associations', 'AssociationsController.index').as('associations.index')
  Route.get('schools', 'SchoolsController.index').as('schools.index')
  Route.get('skills', 'SkillsController.index').as('skills.index')
  Route.get('focus_interests', 'FocusInterestsController.index').as('focus_interests.index')
  Route.get('subjects', 'SubjectsController.index').as('subjects.index')

  if (process.env.NODE_ENV === 'development')
    Route.get('uploads/:filename', async ({ response, params }) => {
      response.download(Application.makePath('../storage/uploads', params.filename))
    }).as('getFile')
})
  .middleware('auth')
  .prefix('api/v1')
  .namespace('App/Controllers/Http/Api/v1')
  .as('api.v1')
