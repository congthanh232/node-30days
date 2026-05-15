import vine from '@vinejs/vine'

/**
 * Validator dùng khi tạo lesson mới
 */
export const createLessonValidator = vine.create({
  title: vine.string().trim().minLength(3).maxLength(255),
  content: vine.string().trim().nullable().optional(),
  videoUrl: vine.string().trim().url().nullable().optional(),
  order: vine.number().positive().optional(),
  isFree: vine.boolean().optional(),
})

/**
 * Validator dùng khi update lesson
 * Tất cả field đều optional
 */
export const updateLessonValidator = vine.create({
  title: vine.string().trim().minLength(3).maxLength(255).optional(),
  content: vine.string().trim().nullable().optional(),
  videoUrl: vine.string().trim().url().nullable().optional(),
  order: vine.number().positive().optional(),
  isFree: vine.boolean().optional(),
})
