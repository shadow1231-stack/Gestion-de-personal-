export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  full_name: string;
  password: string;
}

export interface TokenData {
  access_token: string;
  token_type: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  is_system: boolean;
  is_default: boolean;
}

export interface UserRead {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  role: Role;
}
