/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

// ─── HEALTHCHECK ──────────────────────────────────────────────────────────────
router.get('/health', () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  }
})

// ─── API V1 ───────────────────────────────────────────────────────────────────
router
  .group(() => {
    // Auth — không cần token
    router
      .group(() => {
        router.post('register', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    // Account — cần token
    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    // ─── COURSES public — không cần token ────────────────────────────────────
    router
      .group(() => {
        router.get('/', [controllers.Courses, 'index'])
        router.get('/:id', [controllers.Courses, 'show'])
      })
      .prefix('courses')
      .as('courses.public')

    // ─── COURSES private — cần token + policy ────────────────────────────────
    router
      .group(() => {
        router.post('/', [controllers.Courses, 'store'])
        router.put('/:id', [controllers.Courses, 'update'])
        router.delete('/:id', [controllers.Courses, 'destroy'])
      })
      .prefix('courses')
      .as('courses.private')
      .use(middleware.auth())

    // ─── SUBMISSIONS — student only ───────────────────────────────────────────
    router
      .group(() => {
        router.post('/', [controllers.Submissions, 'store']) // SubmissionPolicy.create
        router.put('/:id', [controllers.Submissions, 'update']) // SubmissionPolicy.edit
      })
      .prefix('submissions')
      .as('submissions')
      .use(middleware.auth())

    // ─── ENROLLMENTS — student only ───────────────────────────────────────────
    router
      .group(() => {
        router.post('/', [controllers.Enrollments, 'store']) // đăng ký khóa học
        router.get('/', [controllers.Enrollments, 'index']) // danh sách đã enrolled
      })
      .prefix('enrollments')
      .as('enrollments')
      .use(middleware.auth())

    // ─── GRADES — instructor only ─────────────────────────────────────────────
    router
      .group(() => {
        router.post('/', [controllers.Grades, 'store'])
      })
      .prefix('grades')
      .as('grades')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
