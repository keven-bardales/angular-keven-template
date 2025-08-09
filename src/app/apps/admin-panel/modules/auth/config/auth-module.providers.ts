import { Provider } from "@angular/core";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { authServiceProvider } from "../services/auth-service";
import { JwtInterceptor } from "../interceptors/jwt.interceptor";

export const authModuleProviders: Provider[] = [
  authServiceProvider,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  }
];

export const provideAuthModuleProviders = () => {
  return authModuleProviders;
}
