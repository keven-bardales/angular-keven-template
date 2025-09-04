/**
 * Backend API Response Types
 * 
 * These types match the backend's ApiResponse pattern used in the Node.js API.
 * All API responses follow this consistent structure.
 */

/**
 * Standard API response wrapper used by the backend
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  errors: ErrorItem[];
  timestamp: string;
}

/**
 * Error item structure from backend validation and error handling
 */
export interface ErrorItem {
  type: string;
  code: string;
  message: string;
  field?: string;
  critical: boolean;
}

/**
 * Authentication response from login/register endpoints
 * Backend returns tokens flat in the data object, not nested
 */
export interface AuthApiResponse {
  user: BackendUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  permissions: string[];
}

/**
 * Backend user structure (matches Prisma User model)
 */
export interface BackendUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: string; // ISO UTC string
  updatedAt: string; // ISO UTC string
  userRoles: BackendUserRole[];
}

/**
 * Backend user role association with full role data
 */
export interface BackendUserRole {
  userId: string;
  roleId: string;
  assignedAt: string; // ISO UTC string
  role: BackendRole;
}

/**
 * Backend role structure with permissions
 */
export interface BackendRole {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  rolePermissions: BackendRolePermission[];
}

/**
 * Backend role-permission association
 */
export interface BackendRolePermission {
  roleId: string;
  permissionId: string;
  assignedAt: string;
  permission: BackendPermission;
}

/**
 * Backend permission structure
 */
export interface BackendPermission {
  id: string;
  moduleId: string;
  action: string;
  scope: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  module: BackendModule;
}

/**
 * Backend module structure
 */
export interface BackendModule {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Backend JWT token structure
 */
export interface BackendTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  tokenType: string; // "Bearer"
}

/**
 * Pagination response structure
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * Generic success response for operations that don't return data
 */
export interface SuccessResponse {
  message: string;
}

/**
 * Health check response structure
 */
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  version: string;
  database: {
    status: 'connected' | 'disconnected';
    responseTime: number;
  };
}