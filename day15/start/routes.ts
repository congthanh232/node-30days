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

    // ─── COURSES — instructor only ────────────────────────────────────────────
    router
      .group(() => {
        router.post('/', [controllers.Courses, 'store']) // CoursePolicy.create
        router.put('/:id', [controllers.Courses, 'update']) // CoursePolicy.edit
        router.delete('/:id', [controllers.Courses, 'destroy']) // CoursePolicy.delete
        router.get('/', [controllers.Courses, 'index']) // public
        router.get('/:id', [controllers.Courses, 'show']) // public
      })
      .prefix('courses')
      .as('courses')
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
  })
  .prefix('/api/v1')
