import { EnrollmentSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Course from '#models/course'

export default class Enrollment extends EnrollmentSchema {
  // Quan hệ N-1: enrollment thuộc về 1 student
  @belongsTo(() => User)
  declare student: BelongsTo<typeof User>

  // Quan hệ N-1: enrollment thuộc về 1 course
  @belongsTo(() => Course)
  declare course: BelongsTo<typeof Course>
}
