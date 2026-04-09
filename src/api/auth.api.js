import api from './axios'

export const authAPI = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
  refreshToken: (data) => api.post('/api/auth/refresh', data),
  logout: () => api.post('/api/auth/logout'),

  // Public dropdowns for registration
  getColleges: () => api.get('/api/auth/colleges'),
  getDepartmentsByCollege: (collegeId) => api.get(`/api/auth/departments/${collegeId}`),
}

export default authAPI