export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8020/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  GET_ME: '/auth/get-me',

  // User Management (backend uses /users)
  USERS: '/users',
  USER_GET: '/users/get',
  USER_ADD: '/users/add',
  USER_UPDATE: '/users/update',
  USER_DISABLE: '/users/disable',
  USER_ENABLE: '/users/enable',
  USER_LIST: '/users/list',

  // Policy Management
  POLICY_GET: '/policy/get',
  POLICY_ADD: '/policy/add',
  POLICY_UPDATE: '/policy/update',
  POLICY_DELETE: '/policy/delete',
  POLICY_LIST: '/policy/list',
  POLICY_ALL: '/policy/list',  // Same as list - backend returns all

  // Permission
  PERMISSION_LIST: '/permission/list',

  // Service Provider Management
  PROVIDER_GET: '/provider/get',
  PROVIDER_ADD: '/provider/add',
  PROVIDER_UPDATE: '/provider/update',
  PROVIDER_DELETE: '/provider/delete',
  PROVIDER_LIST: '/provider/list',
  PROVIDER_APPROVE: '/provider/approve',
  PROVIDER_REJECT: '/provider/reject',
  PROVIDER_BY_USER: '/provider/by-user',

  // Booking Management  
  BOOKING_GET: '/booking/get',
  BOOKING_ADD: '/booking/add',
  BOOKING_UPDATE: '/booking/update',
  BOOKING_CANCEL: '/booking/cancel',
  BOOKING_CONFIRM: '/booking/confirm',
  BOOKING_COMPLETE: '/booking/complete',
  BOOKING_LIST: '/booking/list',
  BOOKING_BY_CUSTOMER: '/booking/by-customer',
  BOOKING_BY_PROVIDER: '/booking/by-provider',
} as const;
