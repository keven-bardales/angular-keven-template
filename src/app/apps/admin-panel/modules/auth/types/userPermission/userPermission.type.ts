export interface UserPermission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
}
