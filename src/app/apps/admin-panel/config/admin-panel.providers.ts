import { Provider } from "@angular/core";
import { provideAdminPanelCoreProviders } from "../core/config/admin-panel-core-providers";
import { provideUserModuleProviders } from "../modules/users/config/user-module.providers";

export const adminPanelProviders : Provider[] = [
  ...provideAdminPanelCoreProviders(),
  ...provideUserModuleProviders()
];

export const provideAdminPanelProviders = () => {
  return adminPanelProviders;
}
