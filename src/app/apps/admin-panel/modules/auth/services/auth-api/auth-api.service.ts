import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginCredentials } from '../../types/login-credentials/login-credentials.type';
import { AuthResponse } from '../../types/auth-response/auth-response.type';
import { LoggedInUser } from '../../types/logged-in-user/logged-in-user.type';
import { AuthTokens } from '../../types/authTokens/authToken.type';
import { RegisterUserRequest } from '../../types/register-user-request/register-user-request.type';
import { ResetPasswordRequest } from '../../types/reset-password-request/reset-password-request.type';
import { ResetPasswordConfirm } from '../../types/reset-password-confirm/reset-password-confirm.type';
import { ChangePasswordRequest } from '../../types/change-password-request/change-password-request.type';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly API_BASE = '/api/v1/auth';

  // Authentication endpoints
  login(credentials: LoginCredentials): Observable<AuthResponse<LoggedInUser>> {
    return this.http.post<AuthResponse<LoggedInUser>>(`${this.API_BASE}/login`, credentials);
  }

  logout(): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.API_BASE}/logout`, {});
  }

  register(userData: RegisterUserRequest): Observable<AuthResponse<LoggedInUser>> {
    return this.http.post<AuthResponse<LoggedInUser>>(`${this.API_BASE}/register`, userData);
  }

  // Password management
  requestPasswordReset(request: ResetPasswordRequest): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.API_BASE}/forgot-password`, request);
  }

  confirmPasswordReset(request: ResetPasswordConfirm): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.API_BASE}/reset-password`, request);
  }

  changePassword(request: ChangePasswordRequest): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.API_BASE}/change-password`, request);
  }

  // Token management
  refreshToken(refreshToken: string): Observable<{ success: boolean; data: AuthTokens }> {
    return this.http.post<{ success: boolean; data: AuthTokens }>(`${this.API_BASE}/refresh`, { 
      refreshToken 
    });
  }

  validateToken(token: string): Observable<{ success: boolean; valid: boolean }> {
    return this.http.post<{ success: boolean; valid: boolean }>(`${this.API_BASE}/validate`, { 
      token 
    });
  }

  revokeToken(token: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.API_BASE}/revoke`, { 
      token 
    });
  }

  // User profile
  getCurrentUser(): Observable<{ success: boolean; data: LoggedInUser }> {
    return this.http.get<{ success: boolean; data: LoggedInUser }>(`${this.API_BASE}/me`);
  }

  updateUserProfile(updates: Partial<LoggedInUser>): Observable<{ success: boolean; data: LoggedInUser }> {
    return this.http.put<{ success: boolean; data: LoggedInUser }>(`${this.API_BASE}/profile`, updates);
  }
}