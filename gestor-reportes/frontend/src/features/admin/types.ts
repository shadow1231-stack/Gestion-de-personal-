export interface AdminUserUpdate {
  full_name?: string;
  email?: string;
  is_active?: boolean;
  role_id?: number;
}

export interface AdminUserCreate {
  email: string;
  full_name: string;
  password: string;
  role_id: number;
}
