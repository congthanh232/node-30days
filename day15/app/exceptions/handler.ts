import app from '@adonisjs/core/services/app'
import { type HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    const { response, request } = ctx
    const traceId = request.id()

    // Lỗi có status code — AppError, validation...
    if (error instanceof Error && 'status' in error) {
      const err = error as Error & { status: number; code?: string }
      return response.status(err.status).json({
        success: false,
        code: err.code ?? 'ERROR',
        message: err.message,
        traceId,
      })
    }
    // Lỗi 500 không lường trước
    if (error instanceof Error) {
      return response.status(500).json({
        success: false,
        code: 'INTERNAL_ERROR',
        message: app.inProduction ? 'Internal Server Error' : error.message,
        traceId,
      })
    }
    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
