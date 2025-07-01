import { AuthError } from "../auth-error/auth-error.type";
import { AuthTokens } from "../authTokens/authToken.type";
import { BaseUser } from "../baseUser/base-user.type";
import { LoggedInUser } from "../logged-in-user/logged-in-user.type";

export interface AuthState<T extends BaseUser = LoggedInUser> {
  isAuthenticated: boolean;
  user: T | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  error: AuthError | null;
}
