import api from './axios'

export const adminAPI = {
  // Colleges
  createCollege: (data) => api.post('/api/admin/colleges', data),
  getColleges: () => api.get('/api/admin/colleges'),
  approveCollege: (id) => api.put(`/api/admin/colleges/${id}/approve`),
  updateCollegeStatus: (id, status) => api.put(`/api/admin/colleges/${id}/status`, null, { params: { status } }),
  assignPrincipal: (id, data) => api.put(`/api/admin/colleges/${id}/assign-principal`, data),

  // User Search (for role assignment)
  searchUsers: (query) => api.get('/api/admin/search-users', { params: { query } }),

  // Seminar Halls
  createSeminarHall: (data) => api.post('/api/admin/seminar-halls', data),
  getSeminarHalls: () => api.get('/api/admin/seminar-halls'),

  // Events
  createEvent: (data) => api.post('/api/admin/events', data),
  getEvents: () => api.get('/api/admin/events'),
  getEventParticipants: (eventId) => api.get(`/api/admin/events/${eventId}/participants`),
  updateEventStatus: (eventId, status) => api.put(`/api/admin/events/${eventId}/status`, { status }),

  // Broadcasts
  createBroadcast: (data) => api.post('/api/admin/broadcasts', data),

  // Dashboard
  getDashboard: () => api.get('/api/admin/dashboard'),
}

export default adminAPI