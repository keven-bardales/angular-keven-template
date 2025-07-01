// src/app/core/auth/interfaces/auth-service.interface.ts
import { Observable } from 'rxjs';
import { Signal } from '@angular/core';
import { LoginCredentials } from '../../types/login-credentials/login-credentials.type';
import { AuthResponse } from '../../types/auth-response/auth-response.type';
import { RegisterUserRequest } from '../../types/register-user-request/register-user-request.type';
import { ResetPasswordRequest } from '../../types/reset-password-request/reset-password-request.type';
import { ResetPasswordConfirm } from '../../types/reset-password-confirm/reset-password-confirm.type';
import { ChangePasswordRequest } from '../../types/change-password-request/change-password-request.type';
import { AuthTokens } from '../../types/authTokens/authToken.type';
import { AuthState } from '../../types/auth-state/auth-state.type';
import { BaseUser } from '../../types/baseUser/base-user.type';
import { LoggedInUser } from '../../types/logged-in-user/logged-in-user.type';


export abstract class IAuthService<T extends BaseUser = LoggedInUser> {
  // Signals for reactive state management
  abstract readonly authState: Signal<AuthState<T>>;
  abstract readonly isAuthenticated: Signal<boolean>;
  abstract readonly currentUser: Signal<T | null>;
  abstract readonly isLoading: Signal<boolean>;
  abstract readonly authError: Signal<string | null>;

  // Authentication methods
  abstract login(credentials: LoginCredentials): Observable<AuthResponse<T> | null>;
  abstract logout(): Observable<null>;
  abstract register(userData: RegisterUserRequest): Observable<AuthResponse<T> | null>;

  // Password management
  abstract resetPassword(request: ResetPasswordRequest): Observable<{ message: string } | null>;
  abstract confirmResetPassword(request: ResetPasswordConfirm): Observable<{ message: string } | null >;
  abstract changePassword(request: ChangePasswordRequest): Observable<{ message: string } | null>;

  // Token management
  abstract refreshToken(): Observable<AuthTokens>;
  abstract validateToken(token?: string): Observable<boolean>;
  abstract revokeToken(token?: string): Observable<void>;

  // User management
  abstract getCurrentUser(): Observable<T | null>;
  abstract refreshUser(): Observable<T | null>;
  abstract updateUserProfile(updates: Partial<T>): Observable<T | null>;

  // Session management
  abstract checkAuthStatus(): Observable<boolean>;
  abstract extendSession(): Observable<AuthTokens | null>;
  abstract getSessionExpiryTime(): Date | null;

  // Utility methods
  abstract hasRole(roleName: string): boolean;
  abstract hasPermission(permission: string, resource?: string): boolean;
  abstract hasAnyRole(roleNames: string[]): boolean;
  abstract hasAnyPermission(permissions: string[], resource?: string): boolean;

  // Storage management
  abstract clearAuthData(): void;
  abstract saveAuthData(response: AuthResponse<T>): void;
  abstract getStoredTokens(): AuthTokens | null;

  // Two-factor authentication (optional)
  abstract verifyTwoFactor?(code: string, token: string): Observable<AuthResponse<T>>;
  abstract enableTwoFactor?(): Observable<{ qrCode: string; backupCodes: string[] }>;
  abstract disableTwoFactor?(password: string): Observable<{ message: string }>;
}
