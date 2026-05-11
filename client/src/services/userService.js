import apiClient from './apiClient.js';

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });

  return searchParams.toString();
};

export const userService = {
  getUsers: (params) => {
    const query = buildQueryString(params);
    return apiClient.get(`/users${query ? `?${query}` : ''}`);
  },

  createUser: (payload) => apiClient.post('/users', payload),

  updateUser: (id, payload) => apiClient.patch(`/users/${id}`, payload),

  deleteUser: (id) => apiClient.delete(`/users/${id}`),
};
