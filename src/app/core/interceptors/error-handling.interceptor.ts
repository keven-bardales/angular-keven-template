import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

/**
 * HTTP Interceptor that handles errors from API responses.
 * 
 * Provides centralized error handling for:
 * - Authentication errors (401) - redirects to login
 * - Authorization errors (403) - shows permission denied
 * - Validation errors (400) - passes through for form handling
 * - Server errors (5xx) - logs and shows generic error
 */
export function errorHandlingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (environment.enableDevLog) {
        console.error('HTTP Error:', error);
      }

      switch (error.status) {
        case 401:
          return handleUnauthorizedError();
        case 403:
          return handleForbiddenError(error);
        case 400:
          // Pass through validation errors to be handled by components
          return throwError(() => error);
        case 500:
        case 502:
        case 503:
        case 504:
          return handleServerError(error);
        default:
          return throwError(() => error);
      }
    })
  );
}

/**
 * Handles 401 Unauthorized errors
 * Clears auth data and redirects to login
 */
function handleUnauthorizedError(): Observable<never> {
  const router = inject(Router);
  
  // Clear authentication data
  localStorage.removeItem(environment.tokenStorageKey);
  localStorage.removeItem(environment.userStorageKey);
  localStorage.removeItem(environment.permissionsStorageKey);
  
  // Redirect to login page
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: router.url, reason: 'session_expired' }
  });
  
  return throwError(() => new Error('Session expired. Please login again.'));
}

/**
 * Handles 403 Forbidden errors
 * Shows permission denied message
 */
function handleForbiddenError(error: HttpErrorResponse): Observable<never> {
  const message = error.error?.message || 'You do not have permission to perform this action.';
  
  if (environment.enableDevLog) {
    console.warn('Access forbidden:', message);
  }
  
  return throwError(() => new Error(message));
}

/**
 * Handles server errors (5xx)
 * Logs error and returns user-friendly message
 */
function handleServerError(error: HttpErrorResponse): Observable<never> {
  const message = 'A server error occurred. Please try again later.';
  
  if (environment.enableDevLog) {
    console.error('Server error:', error.error);
  }
  
  // In production, you might want to send error to logging service
  // logErrorToService(error);
  
  return throwError(() => new Error(message));
}