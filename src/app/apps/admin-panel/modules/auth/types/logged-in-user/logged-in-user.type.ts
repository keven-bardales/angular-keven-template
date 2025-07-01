import { BaseUser } from "../baseUser/base-user.type";

// Default implementation that can be extended
export class LoggedInUser extends BaseUser {
  public avatar?: string;
  public preferences?: Record<string, any>;
  public metadata?: Record<string, any>;

  constructor(data: Partial<LoggedInUser> & { email: string; fullName: string }) {
    super(data);
    this.avatar = data.avatar;
    this.preferences = data.preferences || {};
    this.metadata = data.metadata || {};
  }

  public updatePreference(key: string, value: any): void {
    this.preferences = { ...this.preferences, [key]: value };
    this.updatedAt = new Date();
  }

  public getPreference<T>(key: string, defaultValue?: T): T | undefined {
    return this.preferences?.[key] ?? defaultValue;
  }
}
