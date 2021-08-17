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
import { Resource } from 'App/Controllers/Http/Api/v1/ReportsController'

/**
 * All params named ":id" should be valid numbers
 */
Route.where('id', Route.matchers.number())

Route.get('/', async () => {
  return { message: 'API from INSAMEE' }
})

/**
 * Auth routes
 */
Route.group(() => {
  /**
   * Register, login and logout routes
   */
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
  Route.post('logout', 'AuthController.logout').middleware('auth')

  /**
   * Email confirmation and password reset routes
   */
  Route.post('verify/:email', 'AuthController.verifyEmail').as('verifyEmail')
  Route.post('resetPassword/:email', 'AuthController.resetPassword').as('resetPassword')

  /**
   * Send email confirmation and password reset routes
   */
  Route.group(() => {
    Route.post('verifyEmail', 'AuthController.sendVerifyEmail').as('sendVerifyEmail')
    Route.post('resetPassword', 'AuthController.sendResetPassword').as('sendResetPassword')
  }).prefix('send')
})
  .prefix('auth')
  .namespace('App/Controllers/Http/Auth')

/**
 * Api v1 routes
 */
Route.group(() => {
  /**
   * Users routes
   */
  Route.resource('users', 'UsersController')
    .only(['index', 'show', 'update', 'destroy'])
    .middleware({ index: ['admin'], show: ['admin'], update: ['admin'] })

  /**
   * Profiles routes
   */
  Route.get('profiles/me', 'ProfilesController.me').as('profiles.me')
  Route.get('profiles/me/tutorats/registrations', 'ProfilesController.tutoratsRegistrations').as(
    'profiles.tutorats.registrations.index'
  )
  Route.resource('profiles', 'ProfilesController').only(['index', 'show', 'update'])
  Route.patch('profiles/:id/profiles-pictures', 'ProfilesPicturesController.update').as(
    'profilesPicture.update'
  )
  Route.get('profiles/:id/tutorats', 'ProfilesController.tutorats').as('profiles.tutorats')

  /**
   * Tutorats routes
   */
  Route.resource('tutorats', 'TutoratsController').apiOnly()
  Route.group(() => {
    Route.get('/registrations', 'TutoratsRegistrationsController.index').as('registrations.index')
    Route.post('/registrations', 'TutoratsRegistrationsController.store').as('registrations.store')
    Route.delete('/registrations', 'TutoratsRegistrationsController.destroy').as(
      'registrations.destroy'
    )
    Route.get('/registrations/contacts', 'TutoratsRegistrationsController.contact').as(
      'registrations.contact'
    )
  })
    .prefix('tutorats/:id')
    .as('tutorats.id')

  Route.get('/registrations/:id', 'RegistrationsController.show').as('registrations.show')

  /**
   * Associations routes
   */
  Route.get('associations', 'AssociationsController.index').as('associations.index')
  Route.get('associations/:id', 'AssociationsController.show').as('associations.show')
  Route.get('associations/:id/profiles', 'AssociationsController.profiles').as(
    'associations.profiles'
  )

  /**
   * Reports management routes
   */
  Route.resource('reports/:resource', 'ReportsController')
    .where('resource', new RegExp(Object.values(Resource).join('|')))
    .only(['index', 'show', 'destroy'])
    .middleware({
      index: ['admin'],
      show: ['admin'],
      destroy: ['admin'],
    })
  Route.post('profiles/:id/reports', 'ProfilesReportsController.create').as(
    'profiles.reports.create'
  )
  Route.post('associations/:id/reports', 'AssociationsReportsController.create').as(
    'associations.reports.create'
  )
  Route.post('tutorats/:id/reports', 'TutoratsReportsController.create').as(
    'tutorats.reports.create'
  )
  Route.get('reasons', 'ReasonsController.index').as('reasons.index')

  /**
   * Schools, skills, focus of interests, subjects, tags and thematics routes
   */
  Route.get('schools', 'SchoolsController.index').as('schools.index')
  Route.get('skills', 'SkillsController.index').as('skills.index')
  Route.get('focusInterests', 'FocusInterestsController.index').as('focus_interests.index')
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
