import Api from './baseHttp';
import { API_ENDPOINTS } from '../config/api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  username: string;
  email: string;
  fullName?: string;
  userType?: number;
  userTypeName?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

export const authService = {
  // Login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await Api.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.LOGIN,
      credentials
    );
    
    const loginData = response.data.data; // Backend uses 'data' not 'result'
    
    // Store tokens
    if (loginData && loginData.accessToken) {
      localStorage.setItem('accessToken', loginData.accessToken);
      localStorage.setItem('refreshToken', loginData.refreshToken);
      localStorage.setItem('user', JSON.stringify({
        id: loginData.userId,
        username: loginData.username,
        email: loginData.email,
        fullName: loginData.fullName,
        userType: loginData.userType,
        userTypeName: loginData.userTypeName,
      }));
    }
    
    return loginData;
  },

  // Logout
  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await Api.post(API_ENDPOINTS.LOGOUT, { refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Refresh token
  refreshToken: async (): Promise<LoginResponse | null> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await Api.post<ApiResponse<LoginResponse>>(
        API_ENDPOINTS.REFRESH_TOKEN,
        { refreshToken }
      );
      const loginData = response.data.data;
      
      if (loginData && loginData.accessToken) {
        localStorage.setItem('accessToken', loginData.accessToken);
        localStorage.setItem('refreshToken', loginData.refreshToken);
        localStorage.setItem('user', JSON.stringify({
          id: loginData.userId,
          username: loginData.username,
          email: loginData.email,
          fullName: loginData.fullName,
          userType: loginData.userType,
          userTypeName: loginData.userTypeName,
        }));
      }
      
      return loginData;
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return null;
    }
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  },
};
