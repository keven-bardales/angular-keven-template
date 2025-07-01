import { Observable } from "rxjs";
import { AppUser } from "../../types/user/user.type";

export interface IUserService {

  getAllUsers(): Observable<AppUser[]>;
  getUserById(id: string): Observable<AppUser>;
  createUser(user: AppUser): Observable<AppUser>;
  updateUser(id: string, user: AppUser): Observable<AppUser>;
  deleteUser(id: string): Observable<void>;

}
