import { Provider } from "@angular/core";
import { navigationServiceProvider } from "../services/navigation/navigation-service/index";

export const adminPanelCoreProviders: Provider[] = [
  navigationServiceProvider
];

export const provideAdminPanelCoreProviders = () => {
  return adminPanelCoreProviders;
}
