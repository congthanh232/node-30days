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
        router.get('/', [controllers.Submissions, 'index'])
        router.get('/:id', [controllers.Submissions, 'show'])
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
        router.delete('/:id', [controllers.Enrollments, 'destroy']) // hủy enrollment
      })
      .prefix('enrollments')
      .as('enrollments')
      .use(middleware.auth())

    // ─── GRADES — instructor only ─────────────────────────────────────────────
    router
      .group(() => {
        router.get('/', [controllers.Grades, 'index']) // danh sách đã chấm
        router.get('/:id', [controllers.Grades, 'show']) // chi tiết grade
        router.post('/', [controllers.Grades, 'store'])
      })
      .prefix('grades')
      .as('grades')
      .use(middleware.auth())

    // ─── LESSONS public — không cần token ────────────────────────────────────
    router
      .group(() => {
        router.get('/', [controllers.Lessons, 'index'])
        router.get('/:id', [controllers.Lessons, 'show'])
      })
      .prefix('/courses/:course_id/lessons')
      .as('lessons.public')

    // ─── LESSONS private — cần token + policy ────────────────────────────────
    router
      .group(() => {
        router.post('/', [controllers.Lessons, 'store'])
        router.put('/:id', [controllers.Lessons, 'update'])
        router.delete('/:id', [controllers.Lessons, 'destroy'])
      })
      .prefix('/courses/:course_id/lessons')
      .as('lessons.private')
      .use(middleware.auth())

    // ─── ASSIGNMENTS public — không cần token ────────────────────────────────
    router
      .group(() => {
        router.get('/', [controllers.Assignments, 'index'])
        router.get('/:id', [controllers.Assignments, 'show'])
      })
      .prefix('/courses/:course_id/assignments')
      .as('assignments.public')

    // ─── ASSIGNMENTS private — cần token + policy ────────────────────────────
    router
      .group(() => {
        router.post('/', [controllers.Assignments, 'store'])
        router.put('/:id', [controllers.Assignments, 'update'])
        router.delete('/:id', [controllers.Assignments, 'destroy'])
      })
      .prefix('/courses/:course_id/assignments')
      .as('assignments.private')
      .use(middleware.auth())

    // ─── REPORTS — instructor only ────────────────────────────────────────────
    router
      .group(() => {
        router.get('/courses/:course_id/stats', [controllers.Reports, 'courseStats'])
        router.get('/courses/:course_id/top-students', [controllers.Reports, 'topStudents'])
      })
      .prefix('reports')
      .as('reports')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
