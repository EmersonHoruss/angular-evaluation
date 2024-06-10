import { Error } from './error.interface';

export interface AuthUser {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface AuthState {
  token: string | null;
  loading: boolean;
  error: Error | null;
}
