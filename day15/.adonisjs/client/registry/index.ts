/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/register',
    tokens: [{"old":"/api/v1/auth/register","type":0,"val":"api","end":""},{"old":"/api/v1/auth/register","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/register","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/register","type":0,"val":"register","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [{"old":"/api/v1/account/logout","type":0,"val":"api","end":""},{"old":"/api/v1/account/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/account/logout","type":0,"val":"account","end":""},{"old":"/api/v1/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['profile.access_tokens.destroy']['types'],
  },
  'courses.public.courses.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/courses',
    tokens: [{"old":"/api/v1/courses","type":0,"val":"api","end":""},{"old":"/api/v1/courses","type":0,"val":"v1","end":""},{"old":"/api/v1/courses","type":0,"val":"courses","end":""}],
    types: placeholder as Registry['courses.public.courses.index']['types'],
  },
  'courses.public.courses.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/courses/:id',
    tokens: [{"old":"/api/v1/courses/:id","type":0,"val":"api","end":""},{"old":"/api/v1/courses/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/courses/:id","type":0,"val":"courses","end":""},{"old":"/api/v1/courses/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['courses.public.courses.show']['types'],
  },
  'courses.private.courses.store': {
    methods: ["POST"],
    pattern: '/api/v1/courses',
    tokens: [{"old":"/api/v1/courses","type":0,"val":"api","end":""},{"old":"/api/v1/courses","type":0,"val":"v1","end":""},{"old":"/api/v1/courses","type":0,"val":"courses","end":""}],
    types: placeholder as Registry['courses.private.courses.store']['types'],
  },
  'courses.private.courses.update': {
    methods: ["PUT"],
    pattern: '/api/v1/courses/:id',
    tokens: [{"old":"/api/v1/courses/:id","type":0,"val":"api","end":""},{"old":"/api/v1/courses/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/courses/:id","type":0,"val":"courses","end":""},{"old":"/api/v1/courses/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['courses.private.courses.update']['types'],
  },
  'courses.private.courses.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/courses/:id',
    tokens: [{"old":"/api/v1/courses/:id","type":0,"val":"api","end":""},{"old":"/api/v1/courses/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/courses/:id","type":0,"val":"courses","end":""},{"old":"/api/v1/courses/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['courses.private.courses.destroy']['types'],
  },
  'submissions.submissions.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/submissions',
    tokens: [{"old":"/api/v1/submissions","type":0,"val":"api","end":""},{"old":"/api/v1/submissions","type":0,"val":"v1","end":""},{"old":"/api/v1/submissions","type":0,"val":"submissions","end":""}],
    types: placeholder as Registry['submissions.submissions.index']['types'],
  },
  'submissions.submissions.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/submissions/:id',
    tokens: [{"old":"/api/v1/submissions/:id","type":0,"val":"api","end":""},{"old":"/api/v1/submissions/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/submissions/:id","type":0,"val":"submissions","end":""},{"old":"/api/v1/submissions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['submissions.submissions.show']['types'],
  },
  'submissions.submissions.store': {
    methods: ["POST"],
    pattern: '/api/v1/submissions',
    tokens: [{"old":"/api/v1/submissions","type":0,"val":"api","end":""},{"old":"/api/v1/submissions","type":0,"val":"v1","end":""},{"old":"/api/v1/submissions","type":0,"val":"submissions","end":""}],
    types: placeholder as Registry['submissions.submissions.store']['types'],
  },
  'submissions.submissions.update': {
    methods: ["PUT"],
    pattern: '/api/v1/submissions/:id',
    tokens: [{"old":"/api/v1/submissions/:id","type":0,"val":"api","end":""},{"old":"/api/v1/submissions/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/submissions/:id","type":0,"val":"submissions","end":""},{"old":"/api/v1/submissions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['submissions.submissions.update']['types'],
  },
  'enrollments.enrollments.store': {
    methods: ["POST"],
    pattern: '/api/v1/enrollments',
    tokens: [{"old":"/api/v1/enrollments","type":0,"val":"api","end":""},{"old":"/api/v1/enrollments","type":0,"val":"v1","end":""},{"old":"/api/v1/enrollments","type":0,"val":"enrollments","end":""}],
    types: placeholder as Registry['enrollments.enrollments.store']['types'],
  },
  'enrollments.enrollments.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/enrollments',
    tokens: [{"old":"/api/v1/enrollments","type":0,"val":"api","end":""},{"old":"/api/v1/enrollments","type":0,"val":"v1","end":""},{"old":"/api/v1/enrollments","type":0,"val":"enrollments","end":""}],
    types: placeholder as Registry['enrollments.enrollments.index']['types'],
  },
  'enrollments.enrollments.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/enrollments/:id',
    tokens: [{"old":"/api/v1/enrollments/:id","type":0,"val":"api","end":""},{"old":"/api/v1/enrollments/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/enrollments/:id","type":0,"val":"enrollments","end":""},{"old":"/api/v1/enrollments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['enrollments.enrollments.destroy']['types'],
  },
  'grades.grades.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/grades',
    tokens: [{"old":"/api/v1/grades","type":0,"val":"api","end":""},{"old":"/api/v1/grades","type":0,"val":"v1","end":""},{"old":"/api/v1/grades","type":0,"val":"grades","end":""}],
    types: placeholder as Registry['grades.grades.index']['types'],
  },
  'grades.grades.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/grades/:id',
    tokens: [{"old":"/api/v1/grades/:id","type":0,"val":"api","end":""},{"old":"/api/v1/grades/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/grades/:id","type":0,"val":"grades","end":""},{"old":"/api/v1/grades/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['grades.grades.show']['types'],
  },
  'grades.grades.store': {
    methods: ["POST"],
    pattern: '/api/v1/grades',
    tokens: [{"old":"/api/v1/grades","type":0,"val":"api","end":""},{"old":"/api/v1/grades","type":0,"val":"v1","end":""},{"old":"/api/v1/grades","type":0,"val":"grades","end":""}],
    types: placeholder as Registry['grades.grades.store']['types'],
  },
  'lessons.public.lessons.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/courses/:course_id/lessons',
    tokens: [{"old":"/api/v1/courses/:course_id/lessons","type":0,"val":"api","end":""},{"old":"/api/v1/courses/:course_id/lessons","type":0,"val":"v1","end":""},{"old":"/api/v1/courses/:course_id/lessons","type":0,"val":"courses","end":""},{"old":"/api/v1/courses/:course_id/lessons","type":1,"val":"course_id","end":""},{"old":"/api/v1/courses/:course_id/lessons","type":0,"val":"lessons","end":""}],
    types: placeholder as Registry['lessons.public.lessons.index']['types'],
  },
  'lessons.public.lessons.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/courses/:course_id/lessons/:id',
    tokens: [{"old":"/api/v1/courses/:course_id/lessons/:id","type":0,"val":"api","end":""},{"old":"/api/v1/courses/:course_id/lessons/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/courses/:course_id/lessons/:id","type":0,"val":"courses","end":""},{"old":"/api/v1/courses/:course_id/lessons/:id","type":1,"val":"course_id","end":""},{"old":"/api/v1/courses/:course_id/lessons/:id","type":0,"val":"lessons","end":""},{"old":"/api/v1/courses/:course_id/lessons/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['lessons.public.lessons.show']['types'],
  },
  'lessons.private.lessons.store': {
    methods: ["POST"],
    pattern: '/api/v1/courses/:course_id/lessons',
    tokens: [{"old":"/api/v1/courses/:course_id/lessons","type":0,"val":"api","end":""},{"old":"/api/v1/courses/:course_id/lessons","type":0,"val":"v1","end":""},{"old":"/api/v1/courses/:course_id/lessons","type":0,"val":"courses","end":""},{"old":"/api/v1/courses/:course_id/lessons","type":1,"val":"course_id","end":""},{"old":"/api/v1/courses/:course_id/lessons","type":0,"val":"lessons","end":""}],
    types: placeholder as Registry['lessons.private.lessons.store']['types'],
  },
  'lessons.private.lessons.update': {
    methods: ["PUT"],
    pattern: '/api/v1/courses/:course_id/lessons/:id',
    tokens: [{"old":"/api/v1/courses/:course_id/lessons/:id","type":0,"val":"api","end":""},{"old":"/api/v1/courses/:course_id/lessons/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/courses/:course_id/lessons/:id","type":0,"val":"courses","end":""},{"old":"/api/v1/courses/:course_id/lessons/:id","type":1,"val":"course_id","end":""},{"old":"/api/v1/courses/:course_id/lessons/:id","type":0,"val":"lessons","end":""},{"old":"/api/v1/courses/:course_id/lessons/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['lessons.private.lessons.update']['types'],
  },
  'lessons.private.lessons.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/courses/:course_id/lessons/:id',
    tokens: [{"old":"/api/v1/courses/:course_id/lessons/:id","type":0,"val":"api","end":""},{"old":"/api/v1/courses/:course_id/lessons/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/courses/:course_id/lessons/:id","type":0,"val":"courses","end":""},{"old":"/api/v1/courses/:course_id/lessons/:id","type":1,"val":"course_id","end":""},{"old":"/api/v1/courses/:course_id/lessons/:id","type":0,"val":"lessons","end":""},{"old":"/api/v1/courses/:course_id/lessons/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['lessons.private.lessons.destroy']['types'],
  },
  'assignments.public.assignments.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/courses/:course_id/assignments',
    tokens: [{"old":"/api/v1/courses/:course_id/assignments","type":0,"val":"api","end":""},{"old":"/api/v1/courses/:course_id/assignments","type":0,"val":"v1","end":""},{"old":"/api/v1/courses/:course_id/assignments","type":0,"val":"courses","end":""},{"old":"/api/v1/courses/:course_id/assignments","type":1,"val":"course_id","end":""},{"old":"/api/v1/courses/:course_id/assignments","type":0,"val":"assignments","end":""}],
    types: placeholder as Registry['assignments.public.assignments.index']['types'],
  },
  'assignments.public.assignments.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/courses/:course_id/assignments/:id',
    tokens: [{"old":"/api/v1/courses/:course_id/assignments/:id","type":0,"val":"api","end":""},{"old":"/api/v1/courses/:course_id/assignments/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/courses/:course_id/assignments/:id","type":0,"val":"courses","end":""},{"old":"/api/v1/courses/:course_id/assignments/:id","type":1,"val":"course_id","end":""},{"old":"/api/v1/courses/:course_id/assignments/:id","type":0,"val":"assignments","end":""},{"old":"/api/v1/courses/:course_id/assignments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['assignments.public.assignments.show']['types'],
  },
  'assignments.private.assignments.store': {
    methods: ["POST"],
    pattern: '/api/v1/courses/:course_id/assignments',
    tokens: [{"old":"/api/v1/courses/:course_id/assignments","type":0,"val":"api","end":""},{"old":"/api/v1/courses/:course_id/assignments","type":0,"val":"v1","end":""},{"old":"/api/v1/courses/:course_id/assignments","type":0,"val":"courses","end":""},{"old":"/api/v1/courses/:course_id/assignments","type":1,"val":"course_id","end":""},{"old":"/api/v1/courses/:course_id/assignments","type":0,"val":"assignments","end":""}],
    types: placeholder as Registry['assignments.private.assignments.store']['types'],
  },
  'assignments.private.assignments.update': {
    methods: ["PUT"],
    pattern: '/api/v1/courses/:course_id/assignments/:id',
    tokens: [{"old":"/api/v1/courses/:course_id/assignments/:id","type":0,"val":"api","end":""},{"old":"/api/v1/courses/:course_id/assignments/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/courses/:course_id/assignments/:id","type":0,"val":"courses","end":""},{"old":"/api/v1/courses/:course_id/assignments/:id","type":1,"val":"course_id","end":""},{"old":"/api/v1/courses/:course_id/assignments/:id","type":0,"val":"assignments","end":""},{"old":"/api/v1/courses/:course_id/assignments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['assignments.private.assignments.update']['types'],
  },
  'assignments.private.assignments.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/courses/:course_id/assignments/:id',
    tokens: [{"old":"/api/v1/courses/:course_id/assignments/:id","type":0,"val":"api","end":""},{"old":"/api/v1/courses/:course_id/assignments/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/courses/:course_id/assignments/:id","type":0,"val":"courses","end":""},{"old":"/api/v1/courses/:course_id/assignments/:id","type":1,"val":"course_id","end":""},{"old":"/api/v1/courses/:course_id/assignments/:id","type":0,"val":"assignments","end":""},{"old":"/api/v1/courses/:course_id/assignments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['assignments.private.assignments.destroy']['types'],
  },
  'reports.reports.course_stats': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/reports/courses/:course_id/stats',
    tokens: [{"old":"/api/v1/reports/courses/:course_id/stats","type":0,"val":"api","end":""},{"old":"/api/v1/reports/courses/:course_id/stats","type":0,"val":"v1","end":""},{"old":"/api/v1/reports/courses/:course_id/stats","type":0,"val":"reports","end":""},{"old":"/api/v1/reports/courses/:course_id/stats","type":0,"val":"courses","end":""},{"old":"/api/v1/reports/courses/:course_id/stats","type":1,"val":"course_id","end":""},{"old":"/api/v1/reports/courses/:course_id/stats","type":0,"val":"stats","end":""}],
    types: placeholder as Registry['reports.reports.course_stats']['types'],
  },
  'reports.reports.top_students': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/reports/courses/:course_id/top-students',
    tokens: [{"old":"/api/v1/reports/courses/:course_id/top-students","type":0,"val":"api","end":""},{"old":"/api/v1/reports/courses/:course_id/top-students","type":0,"val":"v1","end":""},{"old":"/api/v1/reports/courses/:course_id/top-students","type":0,"val":"reports","end":""},{"old":"/api/v1/reports/courses/:course_id/top-students","type":0,"val":"courses","end":""},{"old":"/api/v1/reports/courses/:course_id/top-students","type":1,"val":"course_id","end":""},{"old":"/api/v1/reports/courses/:course_id/top-students","type":0,"val":"top-students","end":""}],
    types: placeholder as Registry['reports.reports.top_students']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
