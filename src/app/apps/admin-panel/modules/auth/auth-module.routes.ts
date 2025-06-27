import { Routes } from "@angular/router";

export const authModuleRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./features/login/login.routes').then(m => m.loginRoutes)
  }
]

export async function generateAuthModuleRoutes() {
  return authModuleRoutes;
}

