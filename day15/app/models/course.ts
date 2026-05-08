import { CourseSchema } from '#database/schema'
import { belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Lesson from '#models/lesson'
import Assignment from '#models/assignment'

export default class Course extends CourseSchema {
  // Quan hệ N-1: course thuộc về 1 teacher (user)
  @belongsTo(() => User, {
    foreignKey: 'teacherId', // 👈 chỉ rõ foreign key là teacherId
    localKey: 'id',
  })
  declare teacher: BelongsTo<typeof User>

  // Quan hệ 1-N: course có nhiều lessons
  @hasMany(() => Lesson)
  declare lessons: HasMany<typeof Lesson>

  // Quan hệ 1-N: course có nhiều assignments
  @hasMany(() => Assignment)
  declare assignments: HasMany<typeof Assignment>

  // Quan hệ N-N: course có nhiều students qua enrollments
  @manyToMany(() => User, {
    pivotTable: 'enrollments',
    pivotColumns: ['status', 'paid_price', 'completed_at'],
  })
  declare students: ManyToMany<typeof User>
}
