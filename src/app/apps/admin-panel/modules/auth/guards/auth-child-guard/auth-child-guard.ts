import { CanActivateChildFn } from "@angular/router";
import { authGuard } from "../auth-guard/auth-guard";

export const authChildGuard: CanActivateChildFn = (childRoute, state) => {
  return authGuard(childRoute, state);
};
