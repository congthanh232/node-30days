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
    courses: {
      store: typeof routes['courses.courses.store']
      update: typeof routes['courses.courses.update']
      destroy: typeof routes['courses.courses.destroy']
      index: typeof routes['courses.courses.index']
      show: typeof routes['courses.courses.show']
    }
  }
  submissions: {
    submissions: {
      store: typeof routes['submissions.submissions.store']
      update: typeof routes['submissions.submissions.update']
    }
  }
}
