import { Injectable, computed, signal, inject } from '@angular/core';
import { Observable, of, throwError, delay, tap, catchError, switchMap } from 'rxjs';
import { Router } from '@angular/router';

import { LoggedInUser } from '../../types/logged-in-user/logged-in-user.type';
import { IAuthService } from './auth-service.inteface';
import { AuthState } from '../../types/auth-state/auth-state.type';
import { AuthError } from '../../types/auth-error/auth-error.type';
import { AuthTokens } from '../../types/authTokens/authToken.type';
import { LoginCredentials } from '../../types/login-credentials/login-credentials.type';
import { AuthResponse } from '../../types/auth-response/auth-response.type';
import { RegisterUserRequest } from '../../types/register-user-request/register-user-request.type';
import { ResetPasswordRequest } from '../../types/reset-password-request/reset-password-request.type';
import { ResetPasswordConfirm } from '../../types/reset-password-confirm/reset-password-confirm.type';
import { ChangePasswordRequest } from '../../types/change-password-request/change-password-request.type';

import { AuthApiService } from '../auth-api/auth-api.service';
import { environment } from 'environments/environment';

/**
 * Real Authentication Service
 *
 * Replaces the mock auth service with real API integration.
 * Manages authentication state, token storage, and API communication.
 */
@Injectable({
  providedIn: 'root',
})
// @ts-ignore
export class RealAuthService extends IAuthService<LoggedInUser> {
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);

  // Storage keys from environment
  private readonly STORAGE_KEYS = {
    USER: environment.userStorageKey,
    TOKENS: environment.tokenStorageKey,
    PERMISSIONS: environment.permissionsStorageKey,
  } as const;

  // Auth state management with signals
  private _authState = signal<AuthState<LoggedInUser>>({
    isAuthenticated: false,
    user: null,
    tokens: null,
    isLoading: false,
    error: null,
  });

  // Public readonly signals
  readonly authState = this._authState.asReadonly();
  readonly isAuthenticated = computed(() => this._authState().isAuthenticated);
  readonly currentUser = computed(() => this._authState().user);
  readonly isLoading = computed(() => this._authState().isLoading);
  readonly authError = computed(() => this._authState().error?.message || null);

  constructor() {
    super();
    this.initializeFromStorage();
  }

  /**
   * Initialize auth state from localStorage on app startup
   */
  private initializeFromStorage(): void {
    try {
      const storedUser = localStorage.getItem(this.STORAGE_KEYS.USER);
      const storedTokens = localStorage.getItem(this.STORAGE_KEYS.TOKENS);

      if (storedUser && storedTokens) {
        const userData = JSON.parse(storedUser);
        const tokens = JSON.parse(storedTokens);

        // Check if tokens are still valid
        if (this.areTokensValid(tokens)) {
          const user = new LoggedInUser(userData);
          this.updateAuthState({
            isAuthenticated: true,
            user,
            tokens,
            isLoading: false,
            error: null,
          });
        } else {
          this.clearAuthData();
        }
      }
    } catch (error) {
      console.error('Error initializing auth from storage:', error);
      this.clearAuthData();
    }
  }

  /**
   * Check if stored tokens are still valid
   */
  private areTokensValid(tokens: AuthTokens): boolean {
    if (!tokens.expiresIn) return false;

    // Calculate expiration time
    const expirationTime = Date.now() + tokens.expiresIn * 1000;
    return expirationTime > Date.now() + environment.refreshTokenThreshold;
  }

  /**
   * Update auth state
   */
  private updateAuthState(updates: Partial<AuthState<LoggedInUser>>): void {
    this._authState.update(state => ({ ...state, ...updates }));
  }

  /**
   * Set loading state
   */
  private setLoading(loading: boolean): void {
    this.updateAuthState({ isLoading: loading });
  }

  /**
   * Set error state
   */
  private setError(error: AuthError | null): void {
    this.updateAuthState({ error });
  }

  /**
   * Login with email and password
   */
  login(credentials: LoginCredentials): Observable<AuthResponse<LoggedInUser> | null> {
    console.log('Login credentials:', credentials);
    this.setLoading(true);
    this.setError(null);

    return this.authApi.login(credentials).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.handleSuccessfulAuth(response);
        }
      }),
      tap(() => this.setLoading(false)),
      catchError(error => {
        this.setLoading(false);
        this.setError({
          code: 'LOGIN_FAILED',
          message: error.message || 'Login failed',
        });
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout current user
   */
  logout(): Observable<null> {
    this.setLoading(true);

    return this.authApi.logout().pipe(
      tap(() => {
        this.clearAuthData();
        this.updateAuthState({
          isAuthenticated: false,
          user: null,
          tokens: null,
          isLoading: false,
          error: null,
        });
        this.router.navigate(['/auth/login']);
      }),
      switchMap(() => of(null)),
      catchError(() => {
        // Even if API call fails, clear local data
        this.clearAuthData();
        this.updateAuthState({
          isAuthenticated: false,
          user: null,
          tokens: null,
          isLoading: false,
          error: null,
        });
        this.router.navigate(['/auth/login']);
        return of(null);
      })
    );
  }

  /**
   * Register new user (if registration is enabled)
   */
  register(userData: RegisterUserRequest): Observable<AuthResponse<LoggedInUser> | null> {
    this.setLoading(true);
    this.setError(null);

    return this.authApi.register(userData).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.handleSuccessfulAuth(response);
        }
      }),
      tap(() => this.setLoading(false)),
      catchError(error => {
        this.setLoading(false);
        this.setError({
          code: 'REGISTRATION_FAILED',
          message: error.message || 'Registration failed',
        });
        return throwError(() => error);
      })
    );
  }

  /**
   * Refresh access token using refresh token
   */
  refreshToken(): Observable<AuthTokens> {
    const currentTokens = this.getStoredTokens();
    if (!currentTokens?.refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.authApi.refreshToken(currentTokens.refreshToken).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.updateAuthState({ tokens: response.data });
          localStorage.setItem(this.STORAGE_KEYS.TOKENS, JSON.stringify(response.data));
        }
      }),
      switchMap(response => of(response.data)),
      catchError(error => {
        // If refresh fails, clear auth and redirect to login
        this.clearAuthData();
        this.router.navigate(['/auth/login'], {
          queryParams: { reason: 'session_expired' },
        });
        return throwError(() => error);
      })
    );
  }

  /**
   * Validate current token
   */
  validateToken(token?: string): Observable<boolean> {
    const tokens = this.getStoredTokens();
    if (!tokens) return of(false);

    return of(this.areTokensValid(tokens));
  }

  /**
   * Get current user from API
   */
  getCurrentUser(): Observable<LoggedInUser | null> {
    return this.authApi.getCurrentUser().pipe(
      tap(response => {
        if (response.success && response.data) {
          this.updateAuthState({ user: response.data });
          localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(response.data));
        }
      }),
      switchMap(response => of(response.data)),
      catchError(() => of(null))
    );
  }

  /**
   * Refresh user data from API
   */
  refreshUser(): Observable<LoggedInUser | null> {
    return this.getCurrentUser();
  }

  /**
   * Check authentication status
   */
  checkAuthStatus(): Observable<boolean> {
    return this.validateToken().pipe(
      tap(isValid => {
        if (!isValid && this.isAuthenticated()) {
          this.logout().subscribe();
        }
      })
    );
  }

  /**
   * Handle successful authentication
   */
  private handleSuccessfulAuth(response: AuthResponse<LoggedInUser>): void {
    if (!response.data) return;

    const { user, tokens, permissions } = response.data;

    // Update auth state
    this.updateAuthState({
      isAuthenticated: true,
      user,
      tokens,
      isLoading: false,
      error: null,
    });

    // Store in localStorage
    localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(this.STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
    localStorage.setItem(this.STORAGE_KEYS.PERMISSIONS, JSON.stringify(permissions));
  }

  /**
   * Clear all authentication data
   */
  clearAuthData(): void {
    localStorage.removeItem(this.STORAGE_KEYS.USER);
    localStorage.removeItem(this.STORAGE_KEYS.TOKENS);
    localStorage.removeItem(this.STORAGE_KEYS.PERMISSIONS);
  }

  /**
   * Get stored tokens
   */
  getStoredTokens(): AuthTokens | null {
    try {
      const tokens = localStorage.getItem(this.STORAGE_KEYS.TOKENS);
      return tokens ? JSON.parse(tokens) : null;
    } catch {
      return null;
    }
  }

  // Permission and role checking methods
  hasRole(roleName: string): boolean {
    const user = this.currentUser();
    return user ? user.hasRole(roleName) : false;
  }

  hasPermission(permission: string, scope?: 'OWN' | 'ALL' | 'DEPARTMENT'): boolean {
    const user = this.currentUser();
    return user ? user.hasPermission(permission, scope) : false;
  }

  hasAnyRole(roleNames: string[]): boolean {
    const user = this.currentUser();
    return user ? user.hasAnyRole(roleNames) : false;
  }

  hasAnyPermission(permissions: string[], scope?: 'OWN' | 'ALL' | 'DEPARTMENT'): boolean {
    const user = this.currentUser();
    return user ? user.hasAnyPermission(permissions, scope) : false;
  }

  // Not implemented yet - placeholder methods
  resetPassword(request: ResetPasswordRequest): Observable<{ message: string } | null> {
    return throwError(() => new Error('Password reset not implemented yet'));
  }

  confirmResetPassword(request: ResetPasswordConfirm): Observable<{ message: string } | null> {
    return throwError(() => new Error('Password reset confirmation not implemented yet'));
  }

  changePassword(request: ChangePasswordRequest): Observable<{ message: string } | null> {
    return throwError(() => new Error('Password change not implemented yet'));
  }

  revokeToken(token?: string): Observable<void> {
    return of(void 0);
  }

  updateUserProfile(updates: Partial<LoggedInUser>): Observable<LoggedInUser | null> {
    return throwError(() => new Error('User profile update not implemented yet'));
  }

  extendSession(): Observable<AuthTokens | null> {
    return this.refreshToken();
  }

  getSessionExpiryTime(): Date | null {
    const tokens = this.getStoredTokens();
    if (!tokens) return null;

    return new Date(Date.now() + tokens.expiresIn * 1000);
  }

  // Placeholder methods for interface compliance
  override disableTwoFactor(password: string): Observable<{ message: string }> {
    throw new Error('Two-factor authentication not implemented yet');
  }

  override enableTwoFactor(): Observable<{ qrCode: string; backupCodes: string[] }> {
    throw new Error('Two-factor authentication not implemented yet');
  }

  override verifyTwoFactor(code: string, token: string): Observable<AuthResponse<LoggedInUser>> {
    throw new Error('Two-factor authentication not implemented yet');
  }
}
