export interface User {
  id: number;
  name: string;
  email: string;
  foto_profile: string | null;
  role: string;
  role_label: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: string;
  password: string;
}

export interface UserQuery {
  search?: string;
}
