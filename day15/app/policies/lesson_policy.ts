import type User from '#models/user'
import type Lesson from '#models/lesson'
import type Course from '#models/course'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import RoleService from '#services/role_service'
import { inject } from '@adonisjs/core'

@inject()
export default class LessonPolicy extends BasePolicy {
  constructor(private roleService: RoleService) {
    super()
  }

  /**
   * Chỉ instructor sở hữu course mới được tạo lesson
   */
  async create(user: User, course: Course): Promise<AuthorizerResponse> {
    const isInstructor = await this.roleService.hasRole(user, 'instructor')
    return isInstructor && course.teacherId === user.id
  }

  /**
   * Chỉ instructor sở hữu course mới được sửa lesson
   */
  async edit(user: User, lesson: Lesson): Promise<AuthorizerResponse> {
    const isInstructor = await this.roleService.hasRole(user, 'instructor')
    await lesson.load('course')
    return isInstructor && lesson.course.teacherId === user.id
  }

  /**
   * Chỉ instructor sở hữu course mới được xóa lesson
   */
  async delete(user: User, lesson: Lesson): Promise<AuthorizerResponse> {
    const isInstructor = await this.roleService.hasRole(user, 'instructor')
    await lesson.load('course')
    return isInstructor && lesson.course.teacherId === user.id
  }
}
