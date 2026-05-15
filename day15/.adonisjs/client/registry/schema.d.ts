/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'auth.new_account.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/register'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.access_tokens.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile.profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
  'profile.access_tokens.destroy': {
    methods: ["POST"]
    pattern: '/api/v1/account/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
    }
  }
  'courses.public.courses.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/courses'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/courses_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/courses_controller').default['index']>>>
    }
  }
  'courses.public.courses.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/courses/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/courses_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/courses_controller').default['show']>>>
    }
  }
  'courses.private.courses.store': {
    methods: ["POST"]
    pattern: '/api/v1/courses'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/course').createCourseValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/course').createCourseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/courses_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/courses_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'courses.private.courses.update': {
    methods: ["PUT"]
    pattern: '/api/v1/courses/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/course').updateCourseValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/course').updateCourseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/courses_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/courses_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'courses.private.courses.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/courses/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/courses_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/courses_controller').default['destroy']>>>
    }
  }
  'submissions.submissions.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/submissions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/submissions_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/submissions_controller').default['index']>>>
    }
  }
  'submissions.submissions.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/submissions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/submissions_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/submissions_controller').default['show']>>>
    }
  }
  'submissions.submissions.store': {
    methods: ["POST"]
    pattern: '/api/v1/submissions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/submissions_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/submissions_controller').default['store']>>>
    }
  }
  'submissions.submissions.update': {
    methods: ["PUT"]
    pattern: '/api/v1/submissions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/submissions_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/submissions_controller').default['update']>>>
    }
  }
  'enrollments.enrollments.store': {
    methods: ["POST"]
    pattern: '/api/v1/enrollments'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/enrollment').createEnrollmentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/enrollment').createEnrollmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/enrollments_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/enrollments_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'enrollments.enrollments.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/enrollments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/enrollments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/enrollments_controller').default['index']>>>
    }
  }
  'enrollments.enrollments.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/enrollments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/enrollments_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/enrollments_controller').default['destroy']>>>
    }
  }
  'grades.grades.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/grades'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/grades_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/grades_controller').default['index']>>>
    }
  }
  'grades.grades.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/grades/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/grades_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/grades_controller').default['show']>>>
    }
  }
  'grades.grades.store': {
    methods: ["POST"]
    pattern: '/api/v1/grades'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/grade').createGradeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/grade').createGradeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/grades_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/grades_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'lessons.public.lessons.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/courses/:course_id/lessons'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { course_id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['index']>>>
    }
  }
  'lessons.public.lessons.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/courses/:course_id/lessons/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { course_id: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['show']>>>
    }
  }
  'lessons.private.lessons.store': {
    methods: ["POST"]
    pattern: '/api/v1/courses/:course_id/lessons'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/lesson').createLessonValidator)>>
      paramsTuple: [ParamValue]
      params: { course_id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/lesson').createLessonValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'lessons.private.lessons.update': {
    methods: ["PUT"]
    pattern: '/api/v1/courses/:course_id/lessons/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/lesson').updateLessonValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { course_id: ParamValue; id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/lesson').updateLessonValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'lessons.private.lessons.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/courses/:course_id/lessons/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { course_id: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['destroy']>>>
    }
  }
  'assignments.public.assignments.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/courses/:course_id/assignments'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { course_id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/assignments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/assignments_controller').default['index']>>>
    }
  }
  'assignments.public.assignments.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/courses/:course_id/assignments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { course_id: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/assignments_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/assignments_controller').default['show']>>>
    }
  }
  'assignments.private.assignments.store': {
    methods: ["POST"]
    pattern: '/api/v1/courses/:course_id/assignments'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/assignment').createAssignmentValidator)>>
      paramsTuple: [ParamValue]
      params: { course_id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/assignment').createAssignmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/assignments_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/assignments_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'assignments.private.assignments.update': {
    methods: ["PUT"]
    pattern: '/api/v1/courses/:course_id/assignments/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/assignment').updateAssignmentValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { course_id: ParamValue; id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/assignment').updateAssignmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/assignments_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/assignments_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'assignments.private.assignments.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/courses/:course_id/assignments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { course_id: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/assignments_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/assignments_controller').default['destroy']>>>
    }
  }
  'reports.reports.course_stats': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/reports/courses/:course_id/stats'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { course_id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['courseStats']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['courseStats']>>>
    }
  }
  'reports.reports.top_students': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/reports/courses/:course_id/top-students'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { course_id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['topStudents']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['topStudents']>>>
    }
  }
}
