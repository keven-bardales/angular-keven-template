import { InjectionToken, Provider } from "@angular/core";
import { IUserService } from "./user-service.interface";
import { UserApiService } from "./user-api.service";


export enum UserTokenValue {
  UserToken = 'User'
};

export const UserToken = new InjectionToken<IUserService>(UserTokenValue.UserToken);

export const userServiceProvider: Provider = {
  provide: UserToken,
  useClass: UserApiService
}
