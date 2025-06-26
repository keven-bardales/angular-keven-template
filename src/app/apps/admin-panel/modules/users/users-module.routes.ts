import { Routes } from "@angular/router";

export const usersModuleRoutes: Routes = [
  {
    path: '',
    redirectTo: 'user-management',
    pathMatch: 'full'
  },
  {
    path: 'user-management',
    loadChildren: () => import('./features/user-management/user-management.routes').then(m => m.userManagementRoutes)
  }
]
