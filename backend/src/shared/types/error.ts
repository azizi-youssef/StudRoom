export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'ROOM_NOT_AVAILABLE'
  | 'BOOKING_ALREADY_EXISTS'
  | 'DOUBLE_BOOKING_CONFLICT'
  | 'DATABASE_ERROR'
  | 'INTERNAL_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'TOO_MANY_REQUESTS';



export interface ApiErrorDetail {
  code: ErrorCode;
  message: string;
  field?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiErrorDetail;
  errors?: any[];
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
