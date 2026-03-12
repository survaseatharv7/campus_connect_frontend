import api from './axios'

export const hodAPI = {
  // Events
  createEvent: (data) => api.post('/api/hod/events', data),
  getEvents: () => api.get('/api/hod/events'),
  approveEvent: (id) => api.put(`/api/hod/events/${id}/approve`),

  // Club Requests
  approveClub: (id) => api.post(`/api/hod/club-requests/${id}/approve`),
  rejectClub: (id) => api.post(`/api/hod/club-requests/${id}/reject`),
  getClubRequests: () => api.get('/api/hod/club-requests'),

  // Timetable
  createTimetable: (data) => api.post('/api/hod/timetable', data),
  getTimetable: () => api.get('/api/hod/timetable'),
  updateTimetable: (id, data) => api.put(`/api/hod/timetable/${id}`, data),
  deleteTimetable: (id) => api.delete(`/api/hod/timetable/${id}`),

  // Seminar Halls
  createSeminarHall: (data) => api.post('/api/hod/seminar-halls', data),
  getSeminarHalls: () => api.get('/api/hod/seminar-halls'),

  // Broadcasts
  createBroadcast: (data) => api.post('/api/hod/broadcasts', data),
}

export default hodAPI
