import { Provider } from "@angular/core";
import { authServiceProvider } from "../services/auth-service";

export const authModuleProviders: Provider[] = [
  authServiceProvider
];

export const provideAuthModuleProviders = () => {
  return authModuleProviders;
}
