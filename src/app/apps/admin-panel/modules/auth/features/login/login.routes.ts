import { Routes } from "@angular/router";

export const loginRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/login-page/login-page.routes').then(m => m.loginPageRoutes)
  }
]
