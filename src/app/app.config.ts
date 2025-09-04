import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAdminPanelProviders } from './apps/admin-panel/config/admin-panel.providers';
import { es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { icons } from './icons-provider';
import { provideNzIcons } from 'ng-zorro-antd/icon';

// Import interceptors
import { authTokenInterceptor } from './core/interceptors/auth-token.interceptor';
import { errorHandlingInterceptor } from './core/interceptors/error-handling.interceptor';

registerLocaleData(es);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAdminPanelProviders(),
    provideNzI18n(es_ES),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([
        authTokenInterceptor,
        errorHandlingInterceptor
      ]),
      withFetch() // Use modern fetch API instead of XMLHttpRequest
    ),
    provideNzIcons(icons)
  ]
};
