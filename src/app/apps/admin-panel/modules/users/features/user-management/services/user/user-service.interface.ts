import { Observable } from "rxjs";
import { User, CreateUserRequest, UpdateUserRequest } from "../../types/user/user.type";
import { PaginatedResponse } from "app/shared/models";

export interface UserListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  includeInactive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isActive?: boolean;
  [key: string]: any; // Allow dynamic filter parameters
}

export interface IUserService {
  getUsers(params?: UserListParams): Observable<PaginatedResponse<User>>;
  getUserById(id: string): Observable<User>;
  createUser(user: CreateUserRequest): Observable<User>;
  updateUser(id: string, user: UpdateUserRequest): Observable<User>;
  deleteUser(id: string): Observable<boolean>;
  activateUser(id: string): Observable<User>;
  deactivateUser(id: string): Observable<User>;
}
