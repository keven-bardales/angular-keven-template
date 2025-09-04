import { BaseUser } from '../baseUser/base-user.type';
import { AuthTokens } from '../authTokens/authToken.type';
import { LoggedInUser } from '../logged-in-user/logged-in-user.type';
import { ErrorItem } from '../error-item/error-item.type';

export interface AuthResponse<T extends BaseUser = LoggedInUser> {
  success: boolean;
  data: {
    user: T;
    tokens: AuthTokens;
    permissions: string[];
  } | null;
  errors: ErrorItem[];
  timestamp: string;
}
