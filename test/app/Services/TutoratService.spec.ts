import test from 'japa'
import Tutorat, { TutoratSiting, TutoratType } from 'App/Models/Tutorat'
import Subject from 'App/Models/Subject'
import School from 'App/Models/School'
import User from 'App/Models/User'
import TutoratProfile from 'App/Models/TutoratProfile'
import Profile from 'App/Models/Profile'
import { getTutorat } from 'App/Services/TutoratService'
import NotFoundException from 'App/Exceptions/NotFoundException'

test.group('TutoratService', (group) => {
  const subject = new Subject()
  const school = new School()
  const user = new User()
  const profile = new Profile()
  const tutoratProfile = new TutoratProfile()
  const tutorat = new Tutorat()

  group.before(async () => {
    subject.name = 'subject'
    await subject.save()

    school.name = 'school'
    school.host = 'host'
    await school.save()

    user.email = 'user@user.com'
    user.password = 'password'
    user.isVerified = true
    user.isAdmin = false
    user.isBlocked = false
    await user.save()

    profile.userId = user.id
    profile.schoolId = school.id
    await profile.save()

    tutoratProfile.userId = user.id
    await tutoratProfile.save()
  })

  group.beforeEach(async () => {
    tutorat.userId = user.id
    tutorat.subjectId = subject.id
    tutorat.schoolId = school.id
    tutorat.type = TutoratType.OFFER
    tutorat.siting = TutoratSiting.ONLINE
    await tutorat.save()
  })

  group.afterEach(async () => {
    await tutorat.forceDelete()
  })

  test('should not get a trashed tutorat', async (assert) => {
    assert.plan(2)

    await tutorat.delete()

    try {
      await getTutorat(tutorat.id)
    } catch (error) {
      assert.instanceOf(error, NotFoundException)
      assert.equal(error.message, 'Tutorat introuvable')
    }
  })
})
