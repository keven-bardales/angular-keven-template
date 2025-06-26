import { Routes } from "@angular/router";
import { AdminLayout } from "../core/components/layout/admin-layout/admin-layout";

export const adminPanelRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      {
        path: 'users',
        loadChildren: () => import('../modules/users/users-module.routes').then(m => m.usersModuleRoutes)
      }
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('../modules/auth/auth-module.routes').then(m => m.authModuleRoutes)
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
]
