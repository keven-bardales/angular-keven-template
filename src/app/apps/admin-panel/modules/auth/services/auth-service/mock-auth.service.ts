// src/app/core/auth/services/mock-auth.service.ts
import { Injectable, computed, signal } from '@angular/core';
import { Observable, of, throwError, delay, tap } from 'rxjs';
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


@Injectable()
export class MockAuthService extends IAuthService<LoggedInUser> {
  private readonly STORAGE_KEYS = {
    USER: 'auth_user',
    TOKENS: 'auth_tokens',
    REMEMBER_ME: 'auth_remember_me'
  } as const;

  // Mock users database
  private readonly mockUsers: Record<string, any> = {
    'admin@example.com': {
      uuid: '1',
      email: 'admin@example.com',
      password: 'admin123',
      fullName: 'System Administrator',
      phoneNumber: '+1234567890',
      roles: [
        { id: '1', name: 'admin', description: 'System Administrator' },
        { id: '2', name: 'user', description: 'Regular User' }
      ],
      permissions: ['ADMIN_ACCESS', 'USERS_READ_ALL', 'USERS_WRITE_ALL', 'USERS_DELETE_ALL'],
      avatar: 'https://via.placeholder.com/150',
      isActive: true
    },
    'user@example.com': {
      uuid: '2',
      email: 'user@example.com',
      password: 'user123',
      fullName: 'Regular User',
      phoneNumber: '+0987654321',
      roles: [
        { id: '2', name: 'user', description: 'Regular User' }
      ],
      permissions: ['USERS_READ_OWN', 'PROFILE_UPDATE'],
      avatar: 'https://via.placeholder.com/150',
      isActive: true
    }
  };

  // Auth state management
  private _authState = signal<AuthState<LoggedInUser>>({
    isAuthenticated: false,
    user: null,
    tokens: null,
    isLoading: false,
    error: null
  });

  // Public signals
  readonly authState = this._authState.asReadonly();
  readonly isAuthenticated = computed(() => this._authState().isAuthenticated);
  readonly currentUser = computed(() => this._authState().user);
  readonly isLoading = computed(() => this._authState().isLoading);
  readonly authError = computed(() => this._authState().error?.message || null);

  constructor() {
    super();
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    try {
      const storedUser = localStorage.getItem(this.STORAGE_KEYS.USER);
      const storedTokens = localStorage.getItem(this.STORAGE_KEYS.TOKENS);

      if (storedUser && storedTokens) {
        const userData = JSON.parse(storedUser);
        const tokens = JSON.parse(storedTokens);

        // Check if tokens are still valid (assuming tokens were stored with an expiresAt calculated from expiresIn)
        const expirationTime = tokens.expiresAt || Date.now() + (tokens.expiresIn * 1000);
        if (new Date(expirationTime) > new Date()) {
          const user = new LoggedInUser(userData);
          this.updateAuthState({
            isAuthenticated: true,
            user,
            tokens,
            isLoading: false,
            error: null
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

  private updateAuthState(updates: Partial<AuthState<LoggedInUser>>): void {
    this._authState.update(state => ({ ...state, ...updates }));
  }

  private setLoading(loading: boolean): void {
    this.updateAuthState({ isLoading: loading });
  }

  private setError(error: AuthError | null): void {
    this.updateAuthState({ error });
  }

  private generateMockTokens(): AuthTokens {
    const expiresIn = 24 * 60 * 60; // 24 hours in seconds

    return {
      accessToken: `mock_access_token_${Date.now()}`,
      refreshToken: `mock_refresh_token_${Date.now()}`,
      expiresIn,
      tokenType: 'Bearer'
    };
  }

  login(credentials: LoginCredentials): Observable<AuthResponse<LoggedInUser> | null> {
    this.setLoading(true);
    this.setError(null);

    return of(null).pipe(
      delay(1000), // Simulate API delay
      tap(() => {
        const mockUserData = this.mockUsers[credentials.email];

        if (!mockUserData || mockUserData.password !== credentials.password) {
          throw new Error('Invalid credentials');
        }

        if (!mockUserData.isActive) {
          throw new Error('Account is deactivated');
        }

        const user = new LoggedInUser({
          ...mockUserData,
          lastLoginAt: new Date()
        });

        const tokens = this.generateMockTokens();

        const response: AuthResponse<LoggedInUser> = {
          success: true,
          data: {
            user,
            tokens,
            permissions: mockUserData.permissions || []
          },
          errors: [],
          timestamp: new Date().toISOString()
        };

        this.saveAuthData(response);
        this.updateAuthState({
          isAuthenticated: true,
          user,
          tokens,
          isLoading: false,
          error: null
        });

        return response;
      }),
      tap(undefined, (error) => {
        this.setLoading(false);
        this.setError({
          code: 'LOGIN_FAILED',
          message: error.message || 'Login failed'
        });
        throw error;
      })
    );
  }

  logout(): Observable<null> {
    this.setLoading(true);

    return of(null).pipe(
      delay(500),
      tap(() => {
        this.clearAuthData();
        this.updateAuthState({
          isAuthenticated: false,
          user: null,
          tokens: null,
          isLoading: false,
          error: null
        });
      })
    );
  }

  register(userData: RegisterUserRequest): Observable<AuthResponse<LoggedInUser> | null> {
    this.setLoading(true);
    this.setError(null);

    return of(null).pipe(
      delay(1500),
      tap(() => {
        if (this.mockUsers[userData.email]) {
          throw new Error('User already exists');
        }

        const newUser = new LoggedInUser({
          email: userData.email,
          fullName: userData.fullName,
          phoneNumber: userData.phoneNumber,
          roles: [{ id: '2', name: 'user', description: 'Regular User' }],
          permissions: [
            { id: '1', name: 'read', resource: 'users', action: 'read' },
            { id: '4', name: 'update_profile', resource: 'profile', action: 'update' }
          ]
        });

        // Add to mock database
        this.mockUsers[userData.email] = {
          ...newUser,
          password: userData.password
        };

        const tokens = this.generateMockTokens();
        const response: AuthResponse<LoggedInUser> = {
          success: true,
          data: {
            user: newUser,
            tokens,
            permissions: ['USERS_READ_OWN', 'PROFILE_UPDATE']
          },
          errors: [],
          timestamp: new Date().toISOString()
        };

        this.saveAuthData(response);
        this.updateAuthState({
          isAuthenticated: true,
          user: newUser,
          tokens,
          isLoading: false,
          error: null
        });

        return response;
      }),
      tap(undefined, (error) => {
        this.setLoading(false);
        this.setError({
          code: 'REGISTRATION_FAILED',
          message: error.message || 'Registration failed'
        });
        throw error;
      })
    );
  }

  resetPassword(request: ResetPasswordRequest): Observable<{ message: string } | null> {
    return of(null).pipe(
      delay(1000),
      tap(() => {
        if (!this.mockUsers[request.email]) {
          throw new Error('User not found');
        }
        // In real implementation, send reset email
        console.log(`Reset password email sent to: ${request.email}`);
        return { message: 'Password reset email sent' };
      })
    );
  }

  confirmResetPassword(request: ResetPasswordConfirm): Observable<{ message: string } | null> {
    return of(null).pipe(
      delay(1000),
      tap(() => {
        if (request.newPassword !== request.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        // In real implementation, validate token and update password
        return { message: 'Password reset successful' };
      })
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<{ message: string } | null> {
    return of(null).pipe(
      delay(1000),
      tap(() => {
        const user = this.currentUser();
        if (!user) {
          throw new Error('User not authenticated');
        }

        if (request.newPassword !== request.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        // In real implementation, validate current password and update
        return { message: 'Password changed successfully' };
      })
    );
  }

  refreshToken(): Observable<AuthTokens> {
    const currentTokens = this.getStoredTokens();
    if (!currentTokens) {
      return throwError(() => new Error('No refresh token available'));
    }

    return of(this.generateMockTokens()).pipe(
      delay(500),
      tap(tokens => {
        this.updateAuthState({ tokens });
        localStorage.setItem(this.STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
      })
    );
  }

  validateToken(token?: string): Observable<boolean> {
    const tokens = token ? { accessToken: token, expiresIn: 3600 } as AuthTokens : this.getStoredTokens();
    if (!tokens) return of(false);

    const expirationTime = (tokens as any).expiresAt || Date.now() + (tokens.expiresIn * 1000);
    return of(new Date(expirationTime) > new Date()).pipe(delay(200));
  }

  revokeToken(token?: string): Observable<void> {
    return of(void 0).pipe(
      delay(300),
      tap(() => {
        console.log('Token revoked:', token || 'current token');
      })
    );
  }

  getCurrentUser(): Observable<LoggedInUser | null> {
    return of(this.currentUser()).pipe(delay(100));
  }

  refreshUser(): Observable<LoggedInUser | null> {
    const currentUser = this.currentUser();
    if (!currentUser) {
      return throwError(() => new Error('No authenticated user'));
    }

    return of(null).pipe(
      delay(500),
      tap(() => {
        // In real implementation, fetch fresh user data from API
        const updatedUser = new LoggedInUser({
          ...currentUser,
          lastLoginAt: new Date(),
          updatedAt: new Date()
        });

        this.updateAuthState({ user: updatedUser });
        localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        return updatedUser;
      })
    );
  }

  updateUserProfile(updates: Partial<LoggedInUser>): Observable<LoggedInUser | null> {
    const currentUser = this.currentUser();
    if (!currentUser) {
      return throwError(() => new Error('No authenticated user'));
    }

    return of(null).pipe(
      delay(800),
      tap(() => {
        const updatedUser = new LoggedInUser({
          ...currentUser,
          ...updates,
          updatedAt: new Date()
        });

        this.updateAuthState({ user: updatedUser });
        localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(updatedUser));

        // Update mock database
        if (this.mockUsers[currentUser.email]) {
          this.mockUsers[currentUser.email] = { ...this.mockUsers[currentUser.email], ...updates };
        }

        return updatedUser;
      })
    );
  }

  checkAuthStatus(): Observable<boolean> {
    return this.validateToken().pipe(
      tap(isValid => {
        if (!isValid && this.isAuthenticated()) {
          this.logout().subscribe();
        }
      })
    );
  }

  extendSession(): Observable<AuthTokens | null> {
    return this.refreshToken().pipe(
      tap(() => console.log('Session extended')),
      tap(() => void 0)
    );
  }

  getSessionExpiryTime(): Date | null {
    const tokens = this.getStoredTokens();
    if (!tokens) return null;
    
    const expirationTime = (tokens as any).expiresAt || Date.now() + (tokens.expiresIn * 1000);
    return new Date(expirationTime);
  }

  hasRole(roleName: string): boolean {
    const user = this.currentUser();
    return user ? user.hasRole(roleName) : false;
  }

  hasPermission(permission: string, resource?: string): boolean {
    const user = this.currentUser();
    return user ? user.hasPermission(permission, resource) : false;
  }

  hasAnyRole(roleNames: string[]): boolean {
    const user = this.currentUser();
    return user ? user.hasAnyRole(roleNames) : false;
  }

  hasAnyPermission(permissions: string[], resource?: string): boolean {
    const user = this.currentUser();
    return user ? user.hasAnyPermission(permissions, resource) : false;
  }

  clearAuthData(): void {
    localStorage.removeItem(this.STORAGE_KEYS.USER);
    localStorage.removeItem(this.STORAGE_KEYS.TOKENS);
    localStorage.removeItem(this.STORAGE_KEYS.REMEMBER_ME);
  }

  saveAuthData(response: AuthResponse<LoggedInUser>): void {
    if (response.data?.user) {
      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    }
    if (response.data?.tokens) {
      localStorage.setItem(this.STORAGE_KEYS.TOKENS, JSON.stringify(response.data.tokens));
    }
    if (response.data?.permissions) {
      localStorage.setItem('auth_permissions', JSON.stringify(response.data.permissions));
    }
  }

  getStoredTokens(): AuthTokens | null {
    try {
      const tokens = localStorage.getItem(this.STORAGE_KEYS.TOKENS);
      return tokens ? JSON.parse(tokens) : null;
    } catch {
      return null;
    }
  }

  override disableTwoFactor(password: string): Observable<{ message: string; }> {
    throw new Error()
  }

  override enableTwoFactor(): Observable<{ qrCode: string; backupCodes: string[]; }> {
    throw new Error()
  }


  override verifyTwoFactor(code: string, token: string): Observable<AuthResponse<LoggedInUser>> {
    throw new Error()
  }
}
