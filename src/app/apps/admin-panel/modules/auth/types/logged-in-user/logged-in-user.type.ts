import { BackendUserRole } from 'app/shared/types';
import { UserPermission } from '../userPermission/userPermission.type';
import { BaseItem } from 'app/apps/admin-panel/core/types/base-item/base-item.type';
import { UserRole } from '../userRole/userRole.type';

/**
 * Frontend user model that matches the backend user structure
 * Handles transformation from backend API to frontend-friendly format
 */
export class LoggedInUser extends BaseItem {
  public readonly id: string;
  public readonly email: string;
  public readonly firstName: string | null;
  public readonly lastName: string | null;
  public readonly isActive: boolean;
  public readonly mustChangePassword: boolean;
  public readonly userRoles: BackendUserRole[];
  public readonly createdAt: Date; // ISO UTC string
  public readonly updatedAt: Date; // ISO UTC string
  public roles: UserRole[] = [];
  public permissions: UserPermission[] = [];

  // Additional frontend-specific properties
  public avatar?: string;
  public preferences?: Record<string, any>;

  constructor(data: {
    uuid: string;
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    isActive: boolean;
    mustChangePassword: boolean;
    userRoles: BackendUserRole[];
    createdAt: string;
    updatedAt: string;
    avatar?: string;
    preferences?: Record<string, any>;
  }) {
    super(data.uuid);
    this.id = data.id;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.isActive = data.isActive;
    this.mustChangePassword = data.mustChangePassword;
    this.userRoles = data.userRoles || [];
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
    this.avatar = data.avatar;
    this.preferences = data.preferences || {};
  }

  /**
   * Get user's full name
   */
  public get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    if (this.firstName) {
      return this.firstName;
    }
    if (this.lastName) {
      return this.lastName;
    }
    return this.email; // Fallback to email if no name
  }

  /**
   * Get user's initials for avatars
   */
  public get initials(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
    }
    if (this.firstName) {
      return this.firstName[0].toUpperCase();
    }
    if (this.lastName) {
      return this.lastName[0].toUpperCase();
    }
    return this.email[0].toUpperCase();
  }

  /**
   * Check if user has a specific role
   */
  public hasRole(roleName: string): boolean {
    return this.userRoles.some(
      userRole => userRole.role.name.toLowerCase() === roleName.toLowerCase()
    );
  }

  /**
   * Check if user has a specific permission
   */
  public hasPermission(permissionName: string, scope?: 'OWN' | 'ALL' | 'DEPARTMENT'): boolean {
    return this.userRoles.some(userRole =>
      userRole.role.rolePermissions.some(rolePermission => {
        const permission = rolePermission.permission;
        const nameMatch =
          permission.name === permissionName ||
          `${permission.action.toUpperCase()}_${permission.module.name.toUpperCase()}` ===
            permissionName;
        const scopeMatch = !scope || permission.scope === scope || permission.scope === 'ALL';
        return nameMatch && scopeMatch;
      })
    );
  }

  /**
   * Check if user has any of the specified roles
   */
  public hasAnyRole(roleNames: string[]): boolean {
    return roleNames.some(roleName => this.hasRole(roleName));
  }

  /**
   * Check if user has any of the specified permissions
   */
  public hasAnyPermission(permissions: string[], scope?: 'OWN' | 'ALL' | 'DEPARTMENT'): boolean {
    return permissions.some(permission => this.hasPermission(permission, scope));
  }

  /**
   * Get all user permissions as string array
   */
  public getPermissions(): string[] {
    const permissions: string[] = [];

    this.userRoles.forEach(userRole => {
      userRole.role.rolePermissions.forEach(rolePermission => {
        const permission = rolePermission.permission;
        // Create permission string in format: ACTION_MODULE_SCOPE
        const permissionString = `${permission.action.toUpperCase()}_${permission.module.name.toUpperCase()}_${
          permission.scope
        }`;
        if (!permissions.includes(permissionString)) {
          permissions.push(permissionString);
        }
        // Also add simple format: permission.name
        if (!permissions.includes(permission.name)) {
          permissions.push(permission.name);
        }
      });
    });

    return permissions;
  }

  /**
   * Get all user roles as string array
   */
  public getRoles(): string[] {
    return this.userRoles.map(userRole => userRole.role.name);
  }

  /**
   * Check if user is admin (has admin or superadmin role)
   */
  public get isAdmin(): boolean {
    return this.hasAnyRole(['admin', 'superadmin', 'super_admin']);
  }

  /**
   * Check if user is superadmin
   */
  public get isSuperAdmin(): boolean {
    return this.hasAnyRole(['superadmin', 'super_admin']);
  }

  /**
   * Update user preferences
   */
  public updatePreference(key: string, value: any): void {
    this.preferences = { ...this.preferences, [key]: value };
  }

  /**
   * Get user preference value
   */
  public getPreference<T>(key: string, defaultValue?: T): T | undefined {
    return this.preferences?.[key] ?? defaultValue;
  }
}
