import vine from '@vinejs/vine'

/**
 * Validator dùng khi tạo assignment mới
 */
export const createAssignmentValidator = vine.create({
  title: vine.string().trim().minLength(3).maxLength(255),
  description: vine.string().trim().nullable().optional(),
  maxScore: vine.number().positive().max(1000),
  dueDate: vine.date().optional(),
})

/**
 * Validator dùng khi update assignment
 */
export const updateAssignmentValidator = vine.create({
  title: vine.string().trim().minLength(3).maxLength(255).optional(),
  description: vine.string().trim().nullable().optional(),
  maxScore: vine.number().positive().max(1000).optional(),
  dueDate: vine.date().optional(),
})
