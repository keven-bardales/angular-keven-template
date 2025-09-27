import { Observable } from 'rxjs';
import { IUserService, UserListParams } from './user-service.interface';
import {    CreateUserRequest, UpdateUserRequest, User } from '../../types/user/user.type';
import { Injectable } from '@angular/core';
import { PaginatedResponse } from 'app/shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class UserMockService implements IUserService {
  getAllUsers(): Observable<User[]> {
    throw new Error('Method not implemented.');
  }
  getUserById(id: string): Observable<User> {
    console.log(id);
    throw new Error('Method not implemented.');
  }
  createUser(user: CreateUserRequest): Observable<User> {
    console.log(user);
    throw new Error('Method not implemented.');
  }
  updateUser(id: string, user: UpdateUserRequest): Observable<User> {
    console.log(id);
    console.log(user);
    throw new Error('Method not implemented.');
  }
  deleteUser(id: string): Observable<boolean> {
    console.log(id);
    throw new Error('Method not implemented.');
  }
  activateUser(id: string): Observable<User> {
    console.log(id);
    throw new Error('Method not implemented.');
  }

  deactivateUser(id: string): Observable<User> {
    console.log(id);
    throw new Error('Method not implemented.');
  }

  getUsers(params?: UserListParams): Observable<PaginatedResponse<User>> {
    console.log(params);
    throw new Error('Method not implemented.');
  }
}
