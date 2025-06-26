import { Routes } from "@angular/router";

export const userManagementRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/user-management-page/user-management-page.routes').then(m => m.userManagementPageRoutes)
  }
]
