import AppError from '../errors/AppError.js';

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return next(new AppError({
        code: 'VALIDATION_ERROR',
        message: 'Dữ liệu không hợp lệ',
        status: 400,
        details: result.error.issues,
      }));
    }
    req.validated = result.data;
    next();
  };
}