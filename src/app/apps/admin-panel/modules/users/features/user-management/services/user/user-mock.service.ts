import { Observable } from "rxjs";
import { IUserService } from "./user-service.interface";
import { AppUser } from "../../types/user/user.type";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UserMockService implements IUserService {

  getAllUsers(): Observable<AppUser[]> {
    throw new Error('Method not implemented.');
  }
  getUserById(id: string): Observable<AppUser> {
    throw new Error('Method not implemented.');
  }
  createUser(user: AppUser): Observable<AppUser> {
    throw new Error('Method not implemented.');
  }
  updateUser(id: string, user: AppUser): Observable<AppUser> {
    throw new Error('Method not implemented.');
  }
  deleteUser(id: string): Observable<void> {
    throw new Error('Method not implemented.');
  }
}
