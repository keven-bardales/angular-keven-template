export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
