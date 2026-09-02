import { ApiResponse, ApiErrorDetail, PaginationMeta, ErrorCode } from '../shared/types/error';

/**
 * Build a standard success API response.
 */
export function successResponse<T>(data: T, pagination?: PaginationMeta): ApiResponse<T> {
  const response: ApiResponse<T> = { success: true, data };
  if (pagination) response.pagination = pagination;
  return response;
}

/**
 * Build a standard error API response.
 */
export function errorResponse(code: ErrorCode, message: string, errors?: any[]): ApiResponse<never> {
  const error: ApiErrorDetail = { code, message };
  const response: ApiResponse<never> = { success: false, error };
  if (errors) response.errors = errors;
  return response;
}

/**
 * Custom application error with HTTP status and error code.
 */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: ErrorCode,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}
