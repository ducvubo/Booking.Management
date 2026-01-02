import Api from './baseHttp';

export interface Category {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon?: string;
  parentId?: string;
  sortOrder?: number;
  status: number;
  statusName?: string;
  createdDate?: string;
  updatedDate?: string;
  children?: Category[];
}

export interface CreateCategoryRequest {
  code: string;
  name: string;
  description?: string;
  icon?: string;
  parentId?: string;
  sortOrder?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

export const categoryService = {
  // Get category by ID
  getById: async (id: string): Promise<Category> => {
    const response = await Api.get<ApiResponse<Category>>(
      `/category/get?id=${id}`
    );
    return response.data.data;
  },

  // List all categories
  list: async (): Promise<Category[]> => {
    const response = await Api.get<ApiResponse<Category[]>>('/category/list');
    return response.data.data;
  },

  // Get category tree
  tree: async (): Promise<Category[]> => {
    const response = await Api.get<ApiResponse<Category[]>>('/category/tree');
    return response.data.data;
  },

  // Get root categories
  roots: async (): Promise<Category[]> => {
    const response = await Api.get<ApiResponse<Category[]>>('/category/roots');
    return response.data.data;
  },

  // Get children of a category
  children: async (parentId: string): Promise<Category[]> => {
    const response = await Api.get<ApiResponse<Category[]>>(
      `/category/children?parentId=${parentId}`
    );
    return response.data.data;
  },

  // Get valid parents for a category (excludes self and descendants)
  getValidParents: async (id: string): Promise<Category[]> => {
    const response = await Api.get<ApiResponse<Category[]>>(
      `/category/valid-parents?id=${id}`
    );
    return response.data.data;
  },

  // Create category
  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await Api.post<ApiResponse<Category>>(
      '/category/add',
      data
    );
    return response.data.data;
  },

  // Update category
  update: async (id: string, data: CreateCategoryRequest): Promise<Category> => {
    const response = await Api.put<ApiResponse<Category>>(
      `/category/update?id=${id}`,
      data
    );
    return response.data.data;
  },

  // Disable category
  disable: async (id: string): Promise<Category> => {
    const response = await Api.put<ApiResponse<Category>>(
      `/category/disable?id=${id}`
    );
    return response.data.data;
  },

  // Enable category
  enable: async (id: string): Promise<Category> => {
    const response = await Api.put<ApiResponse<Category>>(
      `/category/enable?id=${id}`
    );
    return response.data.data;
  },
};
