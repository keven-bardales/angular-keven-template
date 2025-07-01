import { Provider } from "@angular/core";
import { userServiceProvider } from "../features/user-management/services/user/index";

export const userModuleProviders: Provider[] = [
  userServiceProvider
];

export const provideUserModuleProviders = () => {
  return userModuleProviders;
}
