import type User from '#models/user'
import type Course from '#models/course'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import RoleService from '#services/role_service'
import { inject } from '@adonisjs/core'
@inject()
export default class CoursePolicy extends BasePolicy {
  constructor(private roleService: RoleService) {
    super()
  }

  /**
   * Chỉ instructor mới được tạo course
   */
  async create(user: User): Promise<AuthorizerResponse> {
    return this.roleService.hasRole(user, 'instructor')
  }

  /**
   * Chỉ instructor sở hữu course mới được sửa
   */
  async edit(user: User, course: Course): Promise<AuthorizerResponse> {
    const isInstructor = await this.roleService.hasRole(user, 'instructor')
    return isInstructor && course.teacherId === user.id
  }

  /**
   * Chỉ instructor sở hữu course mới được xóa
   */
  async delete(user: User, course: Course): Promise<AuthorizerResponse> {
    const isInstructor = await this.roleService.hasRole(user, 'instructor')
    return isInstructor && course.teacherId === user.id
  }
}
