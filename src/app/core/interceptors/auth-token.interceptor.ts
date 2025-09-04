import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * HTTP Interceptor that adds JWT authorization headers to outgoing requests.
 * 
 * Uses Angular's modern functional interceptor pattern introduced in Angular 15+.
 * Automatically attaches Bearer tokens to requests that require authentication.
 */
export function authTokenInterceptor(
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  
  // Get stored tokens from localStorage
  const tokens = getStoredTokens();
  
  // Skip auth for public routes
  if (!tokens || isPublicRoute(req.url)) {
    return next(req);
  }

  // Clone request and add Authorization header
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${tokens.accessToken}`)
  });

  return next(authReq);
}

/**
 * Retrieves stored authentication tokens from localStorage
 */
function getStoredTokens(): { accessToken: string; refreshToken: string } | null {
  try {
    const tokensJson = localStorage.getItem(environment.tokenStorageKey);
    return tokensJson ? JSON.parse(tokensJson) : null;
  } catch {
    return null;
  }
}

/**
 * Determines if a route is public and doesn't require authentication
 */
function isPublicRoute(url: string): boolean {
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password'
  ];
  
  return publicRoutes.some(route => url.includes(route));
}