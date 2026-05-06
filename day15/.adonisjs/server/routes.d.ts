import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'courses.courses.store': { paramsTuple?: []; params?: {} }
    'courses.courses.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courses.courses.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courses.courses.index': { paramsTuple?: []; params?: {} }
    'courses.courses.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'submissions.submissions.store': { paramsTuple?: []; params?: {} }
    'submissions.submissions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'courses.courses.index': { paramsTuple?: []; params?: {} }
    'courses.courses.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'courses.courses.index': { paramsTuple?: []; params?: {} }
    'courses.courses.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'courses.courses.store': { paramsTuple?: []; params?: {} }
    'submissions.submissions.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'courses.courses.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'submissions.submissions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'courses.courses.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}