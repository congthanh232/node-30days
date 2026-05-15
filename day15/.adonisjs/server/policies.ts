export const policies = {
  CoursePolicy: () => import('#policies/course_policy'),
  LessonPolicy: () => import('#policies/lesson_policy'),
  SubmissionPolicy: () => import('#policies/submission_policy'),
}

