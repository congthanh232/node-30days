import type User from '#models/user'
import type Submission from '#models/submission'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import RoleService from '#services/role_service'
import { inject } from '@adonisjs/core'
@inject()
export default class SubmissionPolicy extends BasePolicy {
  constructor(private roleService: RoleService) {
    super()
  }

  /**
   * Chỉ student mới được nộp bài
   */
  async create(user: User): Promise<AuthorizerResponse> {
    return this.roleService.hasRole(user, 'student')
  }

  /**
   * Chỉ student sở hữu submission mới được sửa (khi còn draft)
   */
  async edit(user: User, submission: Submission): Promise<AuthorizerResponse> {
    const isStudent = await this.roleService.hasRole(user, 'student')
    return isStudent && submission.userId === user.id && submission.status === 'draft'
  }
}
