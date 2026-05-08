import vine from '@vinejs/vine'

/**
 * Validator dùng khi đăng ký khóa học
 */
export const createEnrollmentValidator = vine.create({
  courseId: vine.number().positive(),
})
