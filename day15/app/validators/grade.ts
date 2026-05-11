import vine from '@vinejs/vine'

/**
 * Validator dùng khi teacher chấm điểm
 */
export const createGradeValidator = vine.create({
  submissionId: vine.number().positive(),
  score: vine.number().min(0).max(999.99).decimal([0, 2]),
  feedback: vine.string().trim().nullable().optional(),
})
