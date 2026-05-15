/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
  courses: {
    public: {
      courses: {
        index: typeof routes['courses.public.courses.index']
        show: typeof routes['courses.public.courses.show']
      }
    }
    private: {
      courses: {
        store: typeof routes['courses.private.courses.store']
        update: typeof routes['courses.private.courses.update']
        destroy: typeof routes['courses.private.courses.destroy']
      }
    }
  }
  submissions: {
    submissions: {
      index: typeof routes['submissions.submissions.index']
      show: typeof routes['submissions.submissions.show']
      store: typeof routes['submissions.submissions.store']
      update: typeof routes['submissions.submissions.update']
    }
  }
  enrollments: {
    enrollments: {
      store: typeof routes['enrollments.enrollments.store']
      index: typeof routes['enrollments.enrollments.index']
      destroy: typeof routes['enrollments.enrollments.destroy']
    }
  }
  grades: {
    grades: {
      index: typeof routes['grades.grades.index']
      show: typeof routes['grades.grades.show']
      store: typeof routes['grades.grades.store']
    }
  }
  lessons: {
    public: {
      lessons: {
        index: typeof routes['lessons.public.lessons.index']
        show: typeof routes['lessons.public.lessons.show']
      }
    }
    private: {
      lessons: {
        store: typeof routes['lessons.private.lessons.store']
        update: typeof routes['lessons.private.lessons.update']
        destroy: typeof routes['lessons.private.lessons.destroy']
      }
    }
  }
  assignments: {
    public: {
      assignments: {
        index: typeof routes['assignments.public.assignments.index']
        show: typeof routes['assignments.public.assignments.show']
      }
    }
    private: {
      assignments: {
        store: typeof routes['assignments.private.assignments.store']
        update: typeof routes['assignments.private.assignments.update']
        destroy: typeof routes['assignments.private.assignments.destroy']
      }
    }
  }
  reports: {
    reports: {
      courseStats: typeof routes['reports.reports.course_stats']
      topStudents: typeof routes['reports.reports.top_students']
    }
  }
}
