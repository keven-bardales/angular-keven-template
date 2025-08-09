import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin-panel',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES),
  },
  {
    path: 'admin-panel',
    loadChildren: () =>
      import('./apps/admin-panel/config/admin-panel.routes').then(m =>
        m.generateAdminPanelRoutes()
      ),
  },
];
