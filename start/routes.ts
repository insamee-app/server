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
import { Resource } from 'App/Services/ReportService'

/**
 * All params named ":id" should be valid numbers
 */
Route.where('id', Route.matchers.number())
Route.where('resource', new RegExp(Object.values(Resource).join('|')))

Route.get('/', async () => {
  return { message: 'API for TEAM from InsameeApp' }
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
  Route.resource('users', 'UsersController').only(['index', 'show', 'update', 'destroy'])
  Route.get('users/data', 'UsersController.data').middleware('admin').as('users.data')

  /**
   * Profiles routes
   */
  Route.get('profiles/me', 'ProfilesController.me').as('profiles.me')
  Route.get('profiles/me/tutorats/registrations', 'ProfilesController.tutoratsRegistrations').as(
    'profiles.tutorats.registrations.index'
  )
  Route.resource('profiles', 'ProfilesController').only(['index', 'show', 'update'])
  Route.patch('profiles/:id/picture', 'ProfilesPicturesController.update').as(
    'profilesPicture.update'
  )
  Route.delete('profiles/:id/picture', 'ProfilesPicturesController.destroy').as(
    'profilesPicture.destroy'
  )
  Route.get('profiles/:id/tutorats', 'ProfilesController.tutorats').as('profiles.tutorats')

  /**
   * Tutorats routes
   */

  // CRUD operations for tutorats
  Route.resource('tutorats', 'TutoratsController').apiOnly()
  // Used to restore a tutorat
  Route.patch('tutorats/:id/restore', 'TutoratsController.restore')
    .middleware('admin')
    .as('tutorats.restore')

  // Used to manage the interest of tutorials
  Route.group(() => {
    // Used to get the list of users that are interested in a tutorial
    Route.get('/interested/profiles', 'TutoratsInterestsController.index').as('interested.index')
    // Used to manage the user's interest in a tutorat
    Route.get('/interested', 'TutoratsInterestsController.show').as('interested.show')
    Route.post('/interested', 'TutoratsInterestsController.store').as('interested.store')
    Route.delete('/interested', 'TutoratsInterestsController.destroy').as('interested.destroy')

    // Used to get all emails of users who are interested in a tutorat
    Route.get('/interested/contacts', 'TutoratsInterestsController.contact').as(
      'interested.contact'
    )
  })
    .prefix('tutorats/:id')
    .as('tutorats.id')

  // Route.get('/registrations/:id', 'RegistrationsController.show').as('registrations.show')

  /**
   * Associations routes
   */

  // CRUD operations for associations
  Route.resource('associations', 'AssociationsController')
  // Used to restore an association
  Route.patch('associations/:id/restore', 'AssociationsController.restore')
    .middleware('admin')
    .as('associations.restore')
  // Used to add a picture to an association
  Route.patch('associations/:id/picture', 'AssociationsPicturesController.update').as(
    'associationsPicture.update'
  )

  Route.get('associations/:id/profiles', 'AssociationsController.profiles').as(
    'associations.profiles'
  )

  /**
   * Reports management routes
   */
  // Get all reports for specific resource
  Route.get('reports/:resource', 'ReportsController.index').as('reports.resources.index')
  // Get one report by the resource id
  Route.get('reports/:resource/:id', 'ReportsResourcesController.show').as('reports.resources.show')
  // Get one specific report for specific resource
  Route.get('reports/:id/:resource', 'ReportsController.show').as('reports.show')
  // Delete one specific report for specific resource
  Route.delete('reports/:id/:resource', 'ReportsController.destroy').as('reports.destroy')
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

  // CRUD operations for schools
  Route.resource('schools', 'SchoolsController')
    .apiOnly()
    .middleware({
      create: ['admin'],
      update: ['admin'],
      destroy: ['admin'],
    })
  // Used to restore a school
  Route.patch('schools/:id/restore', 'SchoolsController.restore')
    .middleware('admin')
    .as('schools.restore')

  // CRUD operations for skills
  Route.resource('skills', 'SkillsController')
    .apiOnly()
    .middleware({
      create: ['admin'],
      update: ['admin'],
      destroy: ['admin'],
    })
  // Used to restore a skill
  Route.patch('skills/:id/restore', 'SkillsController.restore')
    .middleware('admin')
    .as('skills.restore')

  // CRUD operations for focus of interests
  Route.resource('focus_interests', 'FocusInterestsController')
    .apiOnly()
    .middleware({
      create: ['admin'],
      update: ['admin'],
      destroy: ['admin'],
    })
  // Used to restore a focus of interest
  Route.patch('focus_interests/:id/restore', 'FocusInterestsController.restore')
    .middleware('admin')
    .as('focus_interests.restore')

  // CRUD operations for subjects
  Route.resource('subjects', 'SubjectsController')
    .apiOnly()
    .middleware({
      create: ['admin'],
      update: ['admin'],
      destroy: ['admin'],
    })
  // Used to restore a subject
  Route.patch('subjects/:id/restore', 'SubjectsController.restore')
    .middleware('admin')
    .as('subjects.restore')

  // CRUD operations for tags
  Route.resource('tags', 'TagsController')
    .apiOnly()
    .middleware({
      create: ['admin'],
      update: ['admin'],
      destroy: ['admin'],
    })
  // Used to restore a tag
  Route.patch('tags/:id/restore', 'TagsController.restore').middleware('admin').as('tags.restore')

  // CRUD operations for thematics
  Route.resource('thematics', 'ThematicsController')
    .apiOnly()
    .middleware({
      create: ['admin'],
      update: ['admin'],
      destroy: ['admin'],
    })
  // Used to restore a thematic
  Route.patch('thematics/:id/restore', 'ThematicsController.restore')
    .middleware('admin')
    .as('thematics.restore')
})
  .middleware(['auth', 'blocked'])
  .prefix('api/v1')
  .namespace('App/Controllers/Http/Api/v1')
  .as('api.v1')
