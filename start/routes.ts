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
  Route.post('logout', 'AuthController.logout').middleware('auth')

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

  Route.resource('profiles', 'ProfilesController').only(['index', 'show', 'update'])
  Route.get('profiles/me', 'ProfilesController.me').as('profiles.me')
  Route.get('profiles/me/tutorats/registrations', 'ProfilesController.tutoratsRegistrations').as(
    'profiles.tutorats.registrations.index'
  )
  Route.get('profiles/:id/tutorats', 'ProfilesController.tutorats').as('profiles.tutorats')

  Route.resource('tutorats', 'TutoratsController').apiOnly()
  Route.group(() => {
    Route.get('/registrations', 'TutoratsController.registrations').as('registrations.index')
    Route.post('/registrations', 'TutoratsController.registration').as('registrations.create')
    Route.delete('/registrations', 'TutoratsController.deregistration').as('registrations.destroy')
    Route.get('/registrations/contacts', 'TutoratsController.contact').as('registrations.contact')
  })
    .prefix('tutorats/:id')
    .as('tutorats.id')

  Route.get('associations', 'AssociationsController.index').as('associations.index')
  Route.get('associations/:id', 'AssociationsController.show').as('associations.show')
  Route.get('associations/:id/profiles', 'AssociationsController.profiles').as(
    'associations.profiles'
  )

  Route.post('associations/:id/reports', 'AssociationsReportsController.create').as(
    'associations.reports.create'
  )
  Route.post('tutorats/:id/reports', 'TutoratsReportsController.create').as(
    'tutorats.reports.create'
  )
  Route.get('reasons', 'ReasonsController.index').as('reasons.index')

  Route.get('schools', 'SchoolsController.index').as('schools.index')
  Route.get('skills', 'SkillsController.index').as('skills.index')
  Route.get('focus_interests', 'FocusInterestsController.index').as('focus_interests.index')
  Route.get('subjects', 'SubjectsController.index').as('subjects.index')
  Route.get('tags', 'TagsController.index').as('tags.index')
  Route.get('thematics', 'ThematicsController.index').as('thematics.index')

  if (process.env.NODE_ENV === 'development')
    Route.get('uploads/:filename', async ({ response, params }) => {
      response.download(Application.makePath('../storage/uploads', params.filename))
    }).as('getFile')
})
  .middleware('auth')
  .prefix('api/v1')
  .namespace('App/Controllers/Http/Api/v1')
  .as('api.v1')
