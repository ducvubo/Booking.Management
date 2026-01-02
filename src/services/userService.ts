import Api from './baseHttp';
import { API_ENDPOINTS } from '../config/api';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  address?: string;
  province?: string;
  userType?: number;
  userTypeName?: string;
  status: number;
  statusName?: string;
  createdDate?: string;
  updatedDate?: string;
  policyIds?: string[];
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
  address?: string;
  province?: string;
  userType?: number;
  policyIds?: string[];
}

export interface UpdateUserRequest {
  id: string;
  email?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  province?: string;
  userType?: number;
  status?: number;
  policyIds?: string[];
}

export interface UserListRequest {
  keyword?: string;
  status?: number;
  userType?: number;
  province?: string;
  page?: number;
  size?: number;
}

// Backend uses 'items' instead of 'content'
export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

export const userService = {
  // Get user by ID
  getById: async (id: string): Promise<User> => {
    const response = await Api.get<ApiResponse<User>>(
      `${API_ENDPOINTS.USER_GET}?id=${id}`
    );
    return response.data.data;
  },

  // List users with pagination
  list: async (params: UserListRequest): Promise<PageResponse<User>> => {
    const response = await Api.get<ApiResponse<PageResponse<User>>>(
      API_ENDPOINTS.USER_LIST,
      { params }
    );
    return response.data.data;
  },

  // Create user
  create: async (data: CreateUserRequest): Promise<User> => {
    const response = await Api.post<ApiResponse<User>>(
      API_ENDPOINTS.USER_ADD,
      data
    );
    return response.data.data;
  },

  // Update user (includes policy assignment in same transaction)
  update: async (data: UpdateUserRequest): Promise<User> => {
    const response = await Api.put<ApiResponse<User>>(
      API_ENDPOINTS.USER_UPDATE,
      data
    );
    return response.data.data;
  },

  // Disable user
  disable: async (id: string): Promise<void> => {
    await Api.put<ApiResponse<void>>(`${API_ENDPOINTS.USER_DISABLE}?id=${id}`);
  },

  // Enable user
  enable: async (id: string): Promise<void> => {
    await Api.put<ApiResponse<void>>(`${API_ENDPOINTS.USER_ENABLE}?id=${id}`);
  },
};
