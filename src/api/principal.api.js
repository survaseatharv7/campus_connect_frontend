import api from './axios'

export const principalAPI = {
  // Departments
  createDepartment: (data) => api.post('/api/principal/departments', data),
  getDepartments: () => api.get('/api/principal/departments'),
  assignHOD: (id, data) => api.put(`/api/principal/departments/${id}/assign-hod`, data),

  // Professors
  getProfessors: () => api.get('/api/principal/professors'),

  // Club Requests
  approveClub: (id) => api.post(`/api/principal/club-requests/${id}/approve`),
  rejectClub: (id) => api.post(`/api/principal/club-requests/${id}/reject`),
  getClubRequests: (status) => api.get('/api/principal/club-requests', { params: { status } }),

  // Seminar Halls
  createSeminarHall: (data) => api.post('/api/principal/seminar-halls', data),
  getSeminarHalls: () => api.get('/api/principal/seminar-halls'),
  updateSeminarHall: (id, data) => api.put(`/api/principal/seminar-halls/${id}`, data),

  // Events
  createEvent: (data) => api.post('/api/principal/events', data),
  getEvents: () => api.get('/api/principal/events'),
  approveEvent: (id) => api.put(`/api/principal/events/${id}/approve`),
  getEventParticipants: (eventId) => api.get(`/api/events/${eventId}/participants`),
  updateEventStatus: (eventId, status) => api.put(`/api/principal/events/${eventId}/status`, { status }),
  deleteEvent: (eventId) => api.delete(`/api/events/${eventId}`),

  // Broadcasts
  createBroadcast: (data) => api.post('/api/principal/broadcasts', data),
  getBroadcasts: () => api.get('/api/principal/broadcasts'),
}

export default principalAPI
