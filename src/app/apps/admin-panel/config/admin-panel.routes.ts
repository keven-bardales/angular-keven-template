import { Routes } from "@angular/router";

export const adminPanelRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
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
