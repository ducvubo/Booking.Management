// Common types
export interface ResultMessage<T> {
  success: boolean;
  message: string;
  code: number;
  timestamp: number;
  result: T;
}

// Page Response (Spring Boot format)
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// User types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  address?: string;
  userType?: number;
  userTypeName?: string;
  policyIds?: string[];
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  createdDate: string;
  updatedDate: string;
  deletedDate?: string;
  status: number;
  statusName?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
  address?: string;
  userType?: number;
  policyIds?: string[];
}

export interface UpdateUserRequest {
  id?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  userType?: number;
  policyIds?: string[];
  status?: number;
}

// Policy types
export interface Policy {
  id: string;
  name: string;
  description?: string;
  policies: string[];
  status: number;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  createdDate: string;
  updatedDate: string;
  deletedDate?: string;
}

export interface CreatePolicyRequest {
  name: string;
  description?: string;
  policies: string[];
  status?: number;
}

export interface UpdatePolicyRequest {
  id?: string;
  name?: string;
  description?: string;
  policies?: string[];
  status?: number;
}
