import { InjectionToken, Provider } from "@angular/core";
import { IAuthService } from "./auth-service.inteface";
import { MockAuthService } from "./mock-auth.service";


export enum AuthServiceTokenValue {
  AuthServiceToken = 'AuthServiceToken'
};

export const AuthServiceToken = new InjectionToken<IAuthService>(AuthServiceTokenValue.AuthServiceToken);

export const authServiceProvider: Provider = {
  provide: AuthServiceToken,
  useClass: MockAuthService
}
