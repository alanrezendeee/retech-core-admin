import api from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'SUPER_ADMIN' | 'TENANT_USER';
    tenantId?: string;
    active: boolean;
  };
}

export interface RegisterRequest {
  tenantName: string;
  tenantEmail: string;
  company?: string;
  purpose?: string;
  userName: string;
  userEmail: string;
  userPassword: string;
}

// Login
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

// Register (self-service)
export const register = async (data: RegisterRequest) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

// Get current user
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Refresh token
export const refreshToken = async (refreshToken: string) => {
  const response = await api.post('/auth/refresh', { refreshToken });
  return response.data;
};

