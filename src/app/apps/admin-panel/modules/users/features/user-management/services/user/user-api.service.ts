import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { IUserService, UserListParams } from './user-service.interface';
import { User, CreateUserRequest, UpdateUserRequest } from '../../types/user/user.type';
import { ApiResponse, PaginatedResponse } from 'app/shared/models';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserApiService implements IUserService {
  private readonly http = inject(HttpClient);
  private readonly API_BASE = `${environment.apiUrl}/users`;

  getUsers(params?: UserListParams): Observable<PaginatedResponse<User>> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page);
      if (params.limit) httpParams = httpParams.set('limit', params.limit);
      if (params.searchTerm) httpParams = httpParams.set('searchTerm', params.searchTerm);
      if (params.includeInactive !== undefined) httpParams = httpParams.set('includeInactive', params.includeInactive);
      if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
      if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
      if (params.isActive !== undefined) httpParams = httpParams.set('isActive', params.isActive);

      // Handle any additional filter parameters dynamically
      Object.keys(params).forEach(key => {
        if (!['page', 'limit', 'searchTerm', 'includeInactive', 'sortBy', 'sortOrder', 'isActive'].includes(key)) {
          const value = params[key];
          if (value !== undefined && value !== null) {
            httpParams = httpParams.set(key, value);
          }
        }
      });
    }

    return this.http.get<ApiResponse<PaginatedResponse<User>>>(this.API_BASE, { params: httpParams })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to fetch users');
          }
          return response.data;
        }),
        catchError(error => {
          console.error('Error fetching users:', error);
          return throwError(() => error);
        })
      );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.API_BASE}/${id}`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to fetch user');
          }
          return response.data;
        }),
        catchError(error => {
          console.error(`Error fetching user with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  createUser(user: CreateUserRequest): Observable<User> {
    return this.http.post<ApiResponse<User>>(this.API_BASE, user)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to create user');
          }
          return response.data;
        }),
        catchError(error => {
          console.error('Error creating user:', error);
          return throwError(() => error);
        })
      );
  }

  updateUser(id: string, user: UpdateUserRequest): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.API_BASE}/${id}`, user)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to update user');
          }
          return response.data;
        }),
        catchError(error => {
          console.error(`Error updating user with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  deleteUser(id: string): Observable<boolean> {
    return this.http.delete<ApiResponse<null>>(`${this.API_BASE}/${id}`)
      .pipe(
        map(response => response.success),
        catchError(error => {
          console.error(`Error deleting user with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  activateUser(id: string): Observable<User> {
    return this.http.patch<ApiResponse<User>>(`${this.API_BASE}/${id}/activate`, {})
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to activate user');
          }
          return response.data;
        }),
        catchError(error => {
          console.error(`Error activating user with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  deactivateUser(id: string): Observable<User> {
    return this.http.patch<ApiResponse<User>>(`${this.API_BASE}/${id}/deactivate`, {})
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to deactivate user');
          }
          return response.data;
        }),
        catchError(error => {
          console.error(`Error deactivating user with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }
}
