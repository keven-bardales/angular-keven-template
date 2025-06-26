import { Routes } from "@angular/router";

export const adminPanelRoutes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('../modules/auth/auth-module.routes').then(m => m.authModuleRoutes)
  }
]
