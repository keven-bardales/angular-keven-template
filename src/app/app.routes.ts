import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin-panel',
    pathMatch: 'full'
  },
  {
    path: 'admin-panel',
    loadChildren: () => import('./apps/admin-panel/config/admin-panel.routes').then(m => m.adminPanelRoutes)
  }
];
