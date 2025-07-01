import { BaseUser } from "../baseUser/base-user.type";
import { AuthTokens } from "../authTokens/authToken.type";
import { LoggedInUser } from "../logged-in-user/logged-in-user.type";

export interface AuthResponse<T extends BaseUser = LoggedInUser> {
  user: T;
  tokens?: AuthTokens;
  message?: string;
  requiresTwoFactor?: boolean;
  twoFactorToken?: string;
}
