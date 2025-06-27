import { Provider } from "@angular/core";
import { provideAdminPanelCoreProviders } from "../core/config/admin-panel-core-providers";

export const adminPanelProviders : Provider[] = [
  ...provideAdminPanelCoreProviders()
];

export const provideAdminPanelProviders = () => {
  return adminPanelProviders;
}
