import { Routes } from "@angular/router";

export const userManagementRoutes: Routes = [
  {
    path: 'list',
    loadChildren: () => import('./pages/user-list-page/user-list-page.routes').then(m => m.userListPageRoutes)
  }
]
