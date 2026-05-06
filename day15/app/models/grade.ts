import { GradeSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Submission from '#models/submission'
import User from '#models/user'

export default class Grade extends GradeSchema {
  // Quan hệ 1-1: grade thuộc về 1 submission
  @belongsTo(() => Submission)
  declare submission: BelongsTo<typeof Submission>

  // Quan hệ N-1: grade được chấm bởi 1 teacher
  @belongsTo(() => User, {
    foreignKey: 'graded_by',
  })
  declare teacher: BelongsTo<typeof User>
}
