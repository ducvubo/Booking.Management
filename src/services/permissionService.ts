import Api from './baseHttp';

// Legacy simple permission type
export interface Permission {
  code: string;
  name: string;
  group: string;
}

// Hierarchical permission model for PermissionTree component
export interface PermissionAction {
  key: string;
  method?: string;
  name?: string;
}

export interface PermissionFunction {
  key: string;
  name: string;
  actions?: PermissionAction[];
}

export interface PermissionModel {
  key: string;
  name: string;
  functions?: PermissionFunction[];
  actions?: PermissionAction[];
}

interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

export const permissionService = {
  // Get flat list of permissions (for simple Collapse-based selection)
  list: async (): Promise<Permission[]> => {
    const response = await Api.get<ApiResponse<Permission[]>>('/permission/list');
    return response.data.data || [];
  },

  // Get hierarchical permission tree (for PermissionTree component)
  getTree: async (): Promise<PermissionModel[]> => {
    const response = await Api.get<ApiResponse<PermissionModel[]>>('/permission/tree');
    return response.data.data || [];
  },
};
