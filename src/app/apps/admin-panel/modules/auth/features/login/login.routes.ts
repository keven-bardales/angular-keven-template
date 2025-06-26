import { Routes } from "@angular/router";

export const loginRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/login-page/login-page').then(m => m.LoginPage)
  }
]
