import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { IAuthService } from '../services/auth-service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private readonly authService = inject(IAuthService);
  private readonly router = inject(Router);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const currentTokens = this.authService.getStoredTokens();
    
    // Add auth header if token exists
    if (currentTokens?.accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${currentTokens.accessToken}`
        }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 errors with token refresh
        if (error.status === 401 && currentTokens?.refreshToken) {
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              // Retry the original request with new token
              const newTokens = this.authService.getStoredTokens();
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newTokens?.accessToken}`
                }
              });
              return next.handle(retryReq);
            }),
            catchError(() => {
              // Refresh failed, logout user
              this.authService.logout().subscribe();
              this.router.navigate(['/admin-panel/auth/login'], {
                queryParams: { message: 'Session expired. Please login again.' }
              });
              return throwError(() => error);
            })
          );
        }
        
        return throwError(() => error);
      })
    );
  }
}