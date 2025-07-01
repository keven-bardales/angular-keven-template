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
        loadChildren: () => import('../modules/users/config/users-module.routes').then(m => m.generateUsersModuleRoutes())
      }
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('../modules/auth/auth-module.routes').then(m => m.generateAuthModuleRoutes())
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

export async function generateAdminPanelRoutes(config?: any) {

  let routesToReturn = [...adminPanelRoutes]

  if(!config?.isActive) {
    routesToReturn = routesToReturn.filter((r) => r.path !== 'auth')
  }

  return routesToReturn;
}
