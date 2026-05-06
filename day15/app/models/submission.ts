import { SubmissionSchema } from '#database/schema'
import { belongsTo, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Assignment from '#models/assignment'
import Grade from '#models/grade'

export default class Submission extends SubmissionSchema {
  // Quan hệ N-1: submission thuộc về 1 student
  @belongsTo(() => User)
  declare student: BelongsTo<typeof User>

  // Quan hệ N-1: submission thuộc về 1 assignment
  @belongsTo(() => Assignment)
  declare assignment: BelongsTo<typeof Assignment>

  // Quan hệ 1-1: submission có đúng 1 grade
  @hasOne(() => Grade)
  declare grade: HasOne<typeof Grade>
}
