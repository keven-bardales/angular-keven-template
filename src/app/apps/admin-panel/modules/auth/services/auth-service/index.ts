import { Provider } from "@angular/core";
import { IAuthService } from "./auth-service.inteface";
import { MockAuthService } from "./mock-auth.service";


export const authServiceProvider: Provider = {
  provide: IAuthService,
  useClass: MockAuthService
}
