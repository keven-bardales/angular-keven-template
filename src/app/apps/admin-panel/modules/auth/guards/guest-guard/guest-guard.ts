import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { IAuthService } from "../../services/auth-service/auth-service.inteface";
import { map, take } from "rxjs";

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(IAuthService);
  const router = inject(Router);

  return authService.checkAuthStatus().pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        // Redirect to dashboard or return URL
        const returnUrl = route.queryParams['returnUrl'] || '/admin-panel';
        router.navigate([returnUrl]);
        return false;
      }
      return true;
    })
  );
};
