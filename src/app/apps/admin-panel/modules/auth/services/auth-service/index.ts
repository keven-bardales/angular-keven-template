import { Provider } from '@angular/core';
import { IAuthService } from './auth-service.inteface';
import { RealAuthService } from './real-auth.service';

export { IAuthService } from './auth-service.inteface';

export const authServiceProvider: Provider = {
  provide: IAuthService,
  useClass: RealAuthService,
};
