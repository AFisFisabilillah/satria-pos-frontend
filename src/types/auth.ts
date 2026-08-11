export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  foto_profile: string;
  role: string;
  role_label: string;
}

export interface LoginResponse {
  message: string;
  data: {
    token: string;
    user: User;
  };
}
