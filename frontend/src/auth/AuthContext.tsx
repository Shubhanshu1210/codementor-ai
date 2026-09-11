import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { login as loginRequest, register as registerRequest } from '../api/authApi';
import { AUTH_UNAUTHORIZED_EVENT } from '../api/client';
import {
  clearAuth,
  getToken,
  getUser,
  setToken,
  setUser,
} from './authStorage';
import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from '../types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (request: LoginRequest) => Promise<AuthResponse>;
  register: (request: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setAuthToken] = useState<string | null>(null);
  const [user, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthToken(getToken());
    setAuthUser(getUser());
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setAuthToken(null);
      setAuthUser(null);
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const login = async (request: LoginRequest): Promise<AuthResponse> => {
    const response = await loginRequest(request);
    const authenticatedUser = { email: response.email };
    setToken(response.token);
    setUser(authenticatedUser);
    setAuthToken(response.token);
    setAuthUser(authenticatedUser);
    return response;
  };

  const register = async (request: RegisterRequest): Promise<AuthResponse> => {
    const response = await registerRequest(request);
    const authenticatedUser = { email: response.email };
    setToken(response.token);
    setUser(authenticatedUser);
    setAuthToken(response.token);
    setAuthUser(authenticatedUser);
    return response;
  };

  const logout = () => {
    clearAuth();
    setAuthToken(null);
    setAuthUser(null);
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    isAuthenticated: Boolean(token),
    loading,
    login,
    register,
    logout,
  }), [loading, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
