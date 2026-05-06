import { LessonSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Course from '#models/course'

export default class Lesson extends LessonSchema {
  // Quan hệ N-1: lesson thuộc về 1 course
  @belongsTo(() => Course)
  declare course: BelongsTo<typeof Course>
}
