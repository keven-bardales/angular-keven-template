import { Routes } from "@angular/router";
import { AdminLayout } from "../core/components/layout/admin-layout/admin-layout";
import { authGuard } from "../modules/auth/guards/auth-guard/auth-guard";
import { authChildGuard } from "../modules/auth/guards/auth-child-guard/auth-child-guard";
import { guestGuard } from "../modules/auth/guards/guest-guard/guest-guard";

export const adminPanelRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
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
    canActivate: [guestGuard],
    loadChildren: () => import('../modules/auth/config/auth-module.routes').then(m => m.generateAuthModuleRoutes())
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

export async function generateAdminPanelRoutes(config?: any) {

  let routesToReturn = [...adminPanelRoutes]


  return routesToReturn;
}
