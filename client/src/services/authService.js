import apiClient from './apiClient.js';

export const authService = {
  register: (payload) => apiClient.post('/auth/register', payload),
  login: (payload) => apiClient.post('/auth/login', payload),
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authUser');
    document.cookie = 'accessToken=; Max-Age=0; path=/; SameSite=Lax';
    document.cookie = 'refreshToken=; Max-Age=0; path=/; SameSite=Lax';

    return Promise.resolve({ success: true });
  },
  me: () => apiClient.get('/auth/me'),
};
