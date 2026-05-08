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
