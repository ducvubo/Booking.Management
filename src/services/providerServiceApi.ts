import Api from './baseHttp';

export interface ProviderServiceItem {
  id: string;
  providerId: string;
  providerName?: string;
  categoryId: string;
  categoryCode?: string;
  categoryName?: string;
  priceFrom?: number;
  priceTo?: number;
  description?: string;
  createdDate?: string;
  status: number;
  statusName?: string;
}

export interface ProviderServiceRequest {
  providerId: string;
  categoryId: string;
  priceFrom?: number;
  priceTo?: number;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

export const providerServiceApi = {
  // Get all provider services
  list: async (): Promise<ProviderServiceItem[]> => {
    const response = await Api.get<ApiResponse<ProviderServiceItem[]>>('/provider-service/list');
    return response.data.data;
  },

  // Get by ID
  getById: async (id: string): Promise<ProviderServiceItem> => {
    const response = await Api.get<ApiResponse<ProviderServiceItem>>(`/provider-service/get?id=${id}`);
    return response.data.data;
  },

  // Get by provider ID
  getByProviderId: async (providerId: string): Promise<ProviderServiceItem[]> => {
    const response = await Api.get<ApiResponse<ProviderServiceItem[]>>(
      `/provider-service/by-provider?providerId=${providerId}`
    );
    return response.data.data;
  },

  // Get by category ID
  getByCategoryId: async (categoryId: string): Promise<ProviderServiceItem[]> => {
    const response = await Api.get<ApiResponse<ProviderServiceItem[]>>(
      `/provider-service/by-category?categoryId=${categoryId}`
    );
    return response.data.data;
  },

  // Register service for provider
  register: async (data: ProviderServiceRequest): Promise<ProviderServiceItem> => {
    const response = await Api.post<ApiResponse<ProviderServiceItem>>(
      '/provider-service/register',
      data
    );
    return response.data.data;
  },

  // Update provider service
  update: async (id: string, data: ProviderServiceRequest): Promise<ProviderServiceItem> => {
    const response = await Api.put<ApiResponse<ProviderServiceItem>>(
      `/provider-service/update?id=${id}`,
      data
    );
    return response.data.data;
  },

  // Disable service
  disable: async (id: string): Promise<ProviderServiceItem> => {
    const response = await Api.put<ApiResponse<ProviderServiceItem>>(
      `/provider-service/disable?id=${id}`
    );
    return response.data.data;
  },

  // Enable service
  enable: async (id: string): Promise<ProviderServiceItem> => {
    const response = await Api.put<ApiResponse<ProviderServiceItem>>(
      `/provider-service/enable?id=${id}`
    );
    return response.data.data;
  },
};
