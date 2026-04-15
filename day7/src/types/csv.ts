// Input — row thô đọc từ CSV, chưa biết hợp lệ không
export type RawCsvRow = Record<string, string>;

// Output — row đã validate, hợp lệ
export type ValidRow = Record<string, string>;

// Output — row bị reject, có thêm lý do
export type RejectedRow = RawCsvRow & { _reason: string };

// Utility type — kết quả parse toàn bộ file
export type ParseResult = {
  valid: ValidRow[];
  rejected: RejectedRow[];
};