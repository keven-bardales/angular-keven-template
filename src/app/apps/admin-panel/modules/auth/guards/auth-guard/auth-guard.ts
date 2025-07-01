import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthServiceToken } from "../../services/auth-service";
import { map, take } from "rxjs";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServiceToken);
  const router = inject(Router);

  return authService.checkAuthStatus().pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        // Store the attempted URL for redirecting after login
        const returnUrl = state.url;
        router.navigate(['/admin-panel/auth/login'], {
          queryParams: { returnUrl }
        });
        return false;
      }
    })
  );
};
