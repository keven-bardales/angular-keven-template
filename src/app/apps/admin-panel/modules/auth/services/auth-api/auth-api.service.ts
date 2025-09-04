import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoginCredentials } from '../../types/login-credentials/login-credentials.type';
import { AuthResponse } from '../../types/auth-response/auth-response.type';
import { LoggedInUser } from '../../types/logged-in-user/logged-in-user.type';
import { AuthTokens } from '../../types/authTokens/authToken.type';
import { RegisterUserRequest } from '../../types/register-user-request/register-user-request.type';
import { environment } from 'environments/environment';
import {
  ApiResponse,
  AuthApiResponse,
  BackendTokens,
  BackendUser,
  SuccessResponse,
} from 'app/shared/types';

// Import backend API types

// Import environment

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly API_BASE = `${environment.apiUrl}/auth`;

  /**
   * Authenticate user with email and password
   */
  login(credentials: LoginCredentials): Observable<AuthResponse<LoggedInUser>> {
    return this.http
      .post<ApiResponse<AuthApiResponse>>(`${this.API_BASE}/login`, credentials)
      .pipe(map(response => this.transformToFrontendAuthResponse(response)));
  }

  /**
   * Logout current user and invalidate tokens
   */
  logout(): Observable<{ success: boolean; message: string }> {
    return this.http.post<ApiResponse<SuccessResponse>>(`${this.API_BASE}/logout`, {}).pipe(
      map(response => ({
        success: response.success,
        message: response.data?.message || 'Logged out successfully',
      }))
    );
  }

  /**
   * Register new user account (if registration is enabled)
   */
  register(userData: RegisterUserRequest): Observable<AuthResponse<LoggedInUser>> {
    return this.http
      .post<ApiResponse<AuthApiResponse>>(`${this.API_BASE}/register`, userData)
      .pipe(map(response => this.transformToFrontendAuthResponse(response)));
  }

  /**
   * Token management - refresh access token using refresh token
   */
  refreshToken(refreshToken: string): Observable<{ success: boolean; data: AuthTokens }> {
    return this.http
      .post<ApiResponse<BackendTokens>>(`${this.API_BASE}/refresh`, {
        refreshToken,
      })
      .pipe(
        map(response => ({
          success: response.success,
          data: this.transformToFrontendTokens(response.data!),
        }))
      );
  }

  /**
   * Get current authenticated user profile
   */
  getCurrentUser(): Observable<{ success: boolean; data: LoggedInUser }> {
    return this.http.get<ApiResponse<BackendUser>>(`${this.API_BASE}/me`).pipe(
      map(response => ({
        success: response.success,
        data: this.transformToFrontendUser(response.data!),
      }))
    );
  }

  /**
   * Helper method to transform backend auth response to frontend format
   */
  private transformToFrontendAuthResponse(
    response: ApiResponse<AuthApiResponse>
  ): AuthResponse<LoggedInUser> {
    if (!response.success || !response.data) {
      return {
        success: false,
        data: null,
        errors: response.errors || [],
        timestamp: response.timestamp,
      };
    }

    const user = this.transformToFrontendUser(response.data.user);
    const tokens = this.transformToFrontendTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
      tokenType: response.data.tokenType,
    });

    return {
      success: true,
      data: {
        user,
        tokens,
        permissions: response.data.permissions,
      },
      errors: [],
      timestamp: response.timestamp,
    };
  }

  /**
   * Transform backend user to frontend user model
   */
  private transformToFrontendUser(backendUser: BackendUser): LoggedInUser {
    return new LoggedInUser({
      uuid: backendUser.id, // LoggedInUser constructor expects uuid
      id: backendUser.id,
      email: backendUser.email,
      firstName: backendUser.firstName,
      lastName: backendUser.lastName,
      isActive: backendUser.isActive,
      mustChangePassword: backendUser.mustChangePassword,
      userRoles: backendUser.userRoles,
      createdAt: backendUser.createdAt,
      updatedAt: backendUser.updatedAt,
    });
  }

  /**
   * Transform backend tokens to frontend token format
   */
  private transformToFrontendTokens(backendTokens: BackendTokens): AuthTokens {
    return {
      accessToken: backendTokens.accessToken,
      refreshToken: backendTokens.refreshToken,
      expiresIn: backendTokens.expiresIn,
      tokenType: backendTokens.tokenType,
    };
  }
}
