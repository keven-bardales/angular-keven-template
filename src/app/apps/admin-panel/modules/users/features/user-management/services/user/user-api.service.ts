import { Injectable } from "@angular/core";
import { IUserService } from "./user-service.interface";
import { Observable } from "rxjs";
import { AppUser } from "../../types/user/user.type";

@Injectable({
  providedIn: 'root'
})
export class UserApiService implements IUserService {

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
