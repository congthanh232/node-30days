import { AssignmentSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Course from '#models/course'
import Submission from '#models/submission'

export default class Assignment extends AssignmentSchema {
  // Quan hệ N-1: assignment thuộc về 1 course
  @belongsTo(() => Course)
  declare course: BelongsTo<typeof Course>

  // Quan hệ 1-N: assignment có nhiều submissions từ students
  @hasMany(() => Submission)
  declare submissions: HasMany<typeof Submission>
}
