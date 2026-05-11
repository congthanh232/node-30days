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
      store: typeof routes['submissions.submissions.store']
      update: typeof routes['submissions.submissions.update']
    }
  }
  enrollments: {
    enrollments: {
      store: typeof routes['enrollments.enrollments.store']
      index: typeof routes['enrollments.enrollments.index']
    }
  }
  grades: {
    grades: {
      store: typeof routes['grades.grades.store']
    }
  }
}
