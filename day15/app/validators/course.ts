import vine from '@vinejs/vine'

/**
 * Validator dùng khi tạo course mới
 */
export const createCourseValidator = vine.create({
  title: vine.string().trim().minLength(3).maxLength(255),
  description: vine.string().trim().nullable().optional(),
  price: vine.number().min(0).max(9999999.99).decimal([0, 2]),
  status: vine.enum(['draft', 'published', 'archived']).optional(),
})

/**
 * Validator dùng khi update course
 * Tất cả field đều optional vì có thể chỉ update 1 field
 */
export const updateCourseValidator = vine.create({
  title: vine.string().trim().minLength(3).maxLength(255).optional(),
  description: vine.string().trim().nullable().optional(),
  price: vine.number().min(0).max(9999999.99).decimal([0, 2]).optional(),
  status: vine.enum(['draft', 'published', 'archived']).optional(),
})
