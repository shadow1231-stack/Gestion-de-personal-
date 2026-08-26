export interface RoleCreate {
  name: string;
  description: string;
  permissions: string[];
}

export interface RoleUpdate {
  description?: string;
  permissions?: string[];
}
