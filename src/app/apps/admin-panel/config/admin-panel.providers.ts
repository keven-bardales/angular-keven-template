import { Provider } from "@angular/core";
import { provideAdminPanelCoreProviders } from "../core/config/admin-panel-core-providers";
import { provideUserModuleProviders } from "../modules/users/config/user-module.providers";
import { provideAuthModuleProviders } from "../modules/auth/config/auth-module.providers";

export const adminPanelProviders : Provider[] = [
  ...provideAdminPanelCoreProviders(),
  ...provideUserModuleProviders(),
  ...provideAuthModuleProviders()
];

export const provideAdminPanelProviders = () => {
  return adminPanelProviders;
}
