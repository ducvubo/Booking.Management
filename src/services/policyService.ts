import Api from './baseHttp';
import { API_ENDPOINTS } from '../config/api';

export interface Policy {
  id: string;
  name: string;
  description?: string;
  policies: string[];
  status: number;
  statusName?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface CreatePolicyRequest {
  name: string;
  description?: string;
  policies: string[];
}

export interface UpdatePolicyRequest {
  id: string;
  name?: string;
  description?: string;
  policies?: string[];
}

export interface PolicyListRequest {
  keyword?: string;
  status?: number;
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

export const policyService = {
  // Get policy by ID
  getById: async (id: string): Promise<Policy> => {
    const response = await Api.get<ApiResponse<Policy>>(
      `${API_ENDPOINTS.POLICY_GET}?id=${id}`
    );
    return response.data.data;
  },

  // List policies (returns array, not paginated)
  list: async (params: PolicyListRequest): Promise<Policy[] | PageResponse<Policy>> => {
    const response = await Api.get<ApiResponse<Policy[] | PageResponse<Policy>>>(
      API_ENDPOINTS.POLICY_LIST,
      { params }
    );
    return response.data.data;
  },

  // Get all active policies (for dropdown)
  getAll: async (): Promise<Policy[]> => {
    const response = await Api.get<ApiResponse<Policy[]>>(
      API_ENDPOINTS.POLICY_ALL
    );
    return response.data.data;
  },

  // Create policy
  create: async (data: CreatePolicyRequest): Promise<Policy> => {
    const response = await Api.post<ApiResponse<Policy>>(
      API_ENDPOINTS.POLICY_ADD,
      data
    );
    return response.data.data;
  },

  // Update policy
  update: async (data: UpdatePolicyRequest): Promise<Policy> => {
    const response = await Api.post<ApiResponse<Policy>>(
      API_ENDPOINTS.POLICY_UPDATE,
      data
    );
    return response.data.data;
  },

  // Delete policy
  delete: async (id: string): Promise<void> => {
    await Api.post<ApiResponse<void>>(`${API_ENDPOINTS.POLICY_DELETE}?id=${id}`);
  },
};
