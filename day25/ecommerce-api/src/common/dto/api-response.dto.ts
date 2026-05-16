export class ApiResponse<T> {
  success!: boolean;
  data?: T;
  error?: {
    code: number;
    message: string;
    details?: unknown;
  };
  traceId!: string;
  timestamp!: string;

  static success<T>(data: T, traceId: string): ApiResponse<T> {
    const res = new ApiResponse<T>();
    res.success = true;
    res.data = data;
    res.traceId = traceId;
    res.timestamp = new Date().toISOString();
    return res;
  }

  static error(
    code: number,
    message: string,
    traceId: string,
    details?: unknown,
  ): ApiResponse<null> {
    const res = new ApiResponse<null>();
    res.success = false;
    res.error = { code, message, details };
    res.traceId = traceId;
    res.timestamp = new Date().toISOString();
    return res;
  }
}
