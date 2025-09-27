export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  errors: ErrorItem[];
  timestamp: string;
  statusCode: number;
  message: string;
}

export interface ErrorItem {
  type: string;
  code: string;
  message: string;
  field?: string;
  critical: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}