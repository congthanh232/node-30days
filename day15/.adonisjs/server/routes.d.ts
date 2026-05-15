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
    'submissions.submissions.index': { paramsTuple?: []; params?: {} }
    'submissions.submissions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'submissions.submissions.store': { paramsTuple?: []; params?: {} }
    'submissions.submissions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'enrollments.enrollments.store': { paramsTuple?: []; params?: {} }
    'enrollments.enrollments.index': { paramsTuple?: []; params?: {} }
    'enrollments.enrollments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'grades.grades.index': { paramsTuple?: []; params?: {} }
    'grades.grades.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'grades.grades.store': { paramsTuple?: []; params?: {} }
    'lessons.public.lessons.index': { paramsTuple: [ParamValue]; params: {'course_id': ParamValue} }
    'lessons.public.lessons.show': { paramsTuple: [ParamValue,ParamValue]; params: {'course_id': ParamValue,'id': ParamValue} }
    'lessons.private.lessons.store': { paramsTuple: [ParamValue]; params: {'course_id': ParamValue} }
    'lessons.private.lessons.update': { paramsTuple: [ParamValue,ParamValue]; params: {'course_id': ParamValue,'id': ParamValue} }
    'lessons.private.lessons.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'course_id': ParamValue,'id': ParamValue} }
    'assignments.public.assignments.index': { paramsTuple: [ParamValue]; params: {'course_id': ParamValue} }
    'assignments.public.assignments.show': { paramsTuple: [ParamValue,ParamValue]; params: {'course_id': ParamValue,'id': ParamValue} }
    'assignments.private.assignments.store': { paramsTuple: [ParamValue]; params: {'course_id': ParamValue} }
    'assignments.private.assignments.update': { paramsTuple: [ParamValue,ParamValue]; params: {'course_id': ParamValue,'id': ParamValue} }
    'assignments.private.assignments.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'course_id': ParamValue,'id': ParamValue} }
    'reports.reports.course_stats': { paramsTuple: [ParamValue]; params: {'course_id': ParamValue} }
    'reports.reports.top_students': { paramsTuple: [ParamValue]; params: {'course_id': ParamValue} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'courses.public.courses.index': { paramsTuple?: []; params?: {} }
    'courses.public.courses.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'submissions.submissions.index': { paramsTuple?: []; params?: {} }
    'submissions.submissions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'enrollments.enrollments.index': { paramsTuple?: []; params?: {} }
    'grades.grades.index': { paramsTuple?: []; params?: {} }
    'grades.grades.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lessons.public.lessons.index': { paramsTuple: [ParamValue]; params: {'course_id': ParamValue} }
    'lessons.public.lessons.show': { paramsTuple: [ParamValue,ParamValue]; params: {'course_id': ParamValue,'id': ParamValue} }
    'assignments.public.assignments.index': { paramsTuple: [ParamValue]; params: {'course_id': ParamValue} }
    'assignments.public.assignments.show': { paramsTuple: [ParamValue,ParamValue]; params: {'course_id': ParamValue,'id': ParamValue} }
    'reports.reports.course_stats': { paramsTuple: [ParamValue]; params: {'course_id': ParamValue} }
    'reports.reports.top_students': { paramsTuple: [ParamValue]; params: {'course_id': ParamValue} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'courses.public.courses.index': { paramsTuple?: []; params?: {} }
    'courses.public.courses.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'submissions.submissions.index': { paramsTuple?: []; params?: {} }
    'submissions.submissions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'enrollments.enrollments.index': { paramsTuple?: []; params?: {} }
    'grades.grades.index': { paramsTuple?: []; params?: {} }
    'grades.grades.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lessons.public.lessons.index': { paramsTuple: [ParamValue]; params: {'course_id': ParamValue} }
    'lessons.public.lessons.show': { paramsTuple: [ParamValue,ParamValue]; params: {'course_id': ParamValue,'id': ParamValue} }
    'assignments.public.assignments.index': { paramsTuple: [ParamValue]; params: {'course_id': ParamValue} }
    'assignments.public.assignments.show': { paramsTuple: [ParamValue,ParamValue]; params: {'course_id': ParamValue,'id': ParamValue} }
    'reports.reports.course_stats': { paramsTuple: [ParamValue]; params: {'course_id': ParamValue} }
    'reports.reports.top_students': { paramsTuple: [ParamValue]; params: {'course_id': ParamValue} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'courses.private.courses.store': { paramsTuple?: []; params?: {} }
    'submissions.submissions.store': { paramsTuple?: []; params?: {} }
    'enrollments.enrollments.store': { paramsTuple?: []; params?: {} }
    'grades.grades.store': { paramsTuple?: []; params?: {} }
    'lessons.private.lessons.store': { paramsTuple: [ParamValue]; params: {'course_id': ParamValue} }
    'assignments.private.assignments.store': { paramsTuple: [ParamValue]; params: {'course_id': ParamValue} }
  }
  PUT: {
    'courses.private.courses.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'submissions.submissions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lessons.private.lessons.update': { paramsTuple: [ParamValue,ParamValue]; params: {'course_id': ParamValue,'id': ParamValue} }
    'assignments.private.assignments.update': { paramsTuple: [ParamValue,ParamValue]; params: {'course_id': ParamValue,'id': ParamValue} }
  }
  DELETE: {
    'courses.private.courses.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'enrollments.enrollments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lessons.private.lessons.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'course_id': ParamValue,'id': ParamValue} }
    'assignments.private.assignments.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'course_id': ParamValue,'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}