import { BaseItem } from "app/apps/admin-panel/core/types/base-item/base-item.type";
import { UserRole } from "../userRole/userRole.type";
import { UserPermission } from "../userPermission/userPermission.type";

export abstract class BaseUser extends BaseItem {
  public email: string;
  public fullName: string;
  public phoneNumber?: string;
  public roles: UserRole[];
  public permissions: UserPermission[];
  public isActive: boolean;
  public lastLoginAt?: Date;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: Partial<BaseUser> & { email: string; fullName: string }) {
    super(data.uuid);
    this.email = data.email;
    this.fullName = data.fullName;
    this.phoneNumber = data.phoneNumber;
    this.roles = data.roles || [];
    this.permissions = data.permissions || [];
    this.isActive = data.isActive ?? true;
    this.lastLoginAt = data.lastLoginAt;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  public hasRole(roleName: string): boolean {
    return this.roles.some(role => role.name === roleName);
  }

  public hasPermission(permission: string, resource?: string): boolean {
    return this.permissions.some(perm => {
      const matchesPermission = perm.name === permission || perm.action === permission;
      const matchesResource = !resource || perm.resource === resource;
      return matchesPermission && matchesResource;
    });
  }

  public hasAnyRole(roleNames: string[]): boolean {
    return roleNames.some(roleName => this.hasRole(roleName));
  }

  public hasAnyPermission(permissions: string[], resource?: string): boolean {
    return permissions.some(permission => this.hasPermission(permission, resource));
  }
}
