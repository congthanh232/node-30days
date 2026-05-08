import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'courses.public.courses.index': { paramsTuple?: []; params?: {} }
    'courses.public.courses.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courses.private.courses.store': { paramsTuple?: []; params?: {} }
    'courses.private.courses.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courses.private.courses.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'submissions.submissions.store': { paramsTuple?: []; params?: {} }
    'submissions.submissions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'enrollments.enrollments.store': { paramsTuple?: []; params?: {} }
    'enrollments.enrollments.index': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'courses.public.courses.index': { paramsTuple?: []; params?: {} }
    'courses.public.courses.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'enrollments.enrollments.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'courses.public.courses.index': { paramsTuple?: []; params?: {} }
    'courses.public.courses.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'enrollments.enrollments.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'courses.private.courses.store': { paramsTuple?: []; params?: {} }
    'submissions.submissions.store': { paramsTuple?: []; params?: {} }
    'enrollments.enrollments.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'courses.private.courses.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'submissions.submissions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'courses.private.courses.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}