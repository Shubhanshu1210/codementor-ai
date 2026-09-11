export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  email: string;
}

export interface AuthResponse {
  token: string;
  message: string;
  email: string;
}
