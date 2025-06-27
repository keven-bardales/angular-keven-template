import { InjectionToken, Provider } from "@angular/core";
import { NavigationService } from "./navigation-service-impl.service";

export enum NavigationServiceTokenValue {
  NavigationServiceToken = 'NavigationService'
}

export const NavigationServiceToken = new InjectionToken<NavigationService>(NavigationServiceTokenValue.NavigationServiceToken);

export const navigationServiceProvider: Provider = {
  provide: NavigationServiceToken,
  useClass: NavigationService,
}
