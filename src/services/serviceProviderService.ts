import http from './baseHttp';

export interface ServiceProvider {
  id: string;
  userId: string;
  businessName: string;
  phone?: string;
  email?: string;
  address?: string;
  province?: string;
  district?: string;
  ward?: string;
  description?: string;
  rating?: number;
  totalReviews?: number;
  status: number;
  statusName?: string;
  createdDate?: string;
  // User info (joined)
  userName?: string;
  userFullName?: string;
}

export interface CreateProviderRequest {
  userId: string;
  businessName: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
}

export interface UpdateProviderRequest {
  id: string;
  businessName: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
}

export interface RegisterProviderWithAccountRequest {
  username: string;
  password: string;
  email: string;
  phone?: string;
  fullName?: string;
  address?: string;
  businessName?: string;
  description?: string;
  province?: string;
  district?: string;
  ward?: string;
}

const serviceProviderService = {
  // Get list with pagination
  async getList(page = 1, size = 10, province?: string) {
    return http.get('/provider/list', { 
      params: { page, size, province } 
    });
  },

  // Get by ID
  async getById(id: string) {
    return http.get('/provider/get', { params: { id } });
  },

  // Get by User ID
  async getByUserId(userId: string) {
    return http.get('/provider/by-user', { params: { userId } });
  },

  // Create new provider
  async create(data: CreateProviderRequest) {
    return http.post('/provider/add', data);
  },

  // Update provider
  async update(data: UpdateProviderRequest) {
    return http.post('/provider/update', data);
  },

  // Delete provider
  async delete(id: string) {
    return http.post('/provider/delete', null, { params: { id } });
  },

  // Approve provider
  async approve(id: string) {
    return http.post('/provider/approve', null, { params: { id } });
  },

  // Reject provider
  async reject(id: string, reason?: string) {
    return http.post('/provider/reject', null, { params: { id, reason } });
  },

  // Register provider with new account
  async registerWithAccount(data: RegisterProviderWithAccountRequest) {
    return http.post('/provider/register-with-account', data);
  },
};

export default serviceProviderService;
