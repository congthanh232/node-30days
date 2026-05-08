import { BaseTransformer } from '@adonisjs/core/transformers'
import type Course from '#models/course'

export default class CourseTransformer extends BaseTransformer<Course> {
  toObject() {
    const base = this.pick(this.resource, ['id', 'title', 'description', 'status', 'createdAt'])

    return {
      ...base,
      price: Number(this.resource.price),
      teacher: this.resource.teacher
        ? {
            id: this.resource.teacher.id,
            fullName: this.resource.teacher.fullName,
          }
        : undefined,
      lessons: this.resource.lessons
        ? this.resource.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.order,
            isFree: lesson.isFree,
          }))
        : undefined,
    }
  }
}
