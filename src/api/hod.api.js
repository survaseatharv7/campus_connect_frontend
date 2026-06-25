import api from './axios'

export const hodAPI = {
  // Events
  createEvent: (data) => api.post('/api/hod/events', data),
  getEvents: () => api.get('/api/hod/events'),
  approveEvent: (id) => api.put(`/api/hod/events/${id}/approve`),
  getEventParticipants: (eventId) => api.get(`/api/events/${eventId}/participants`),
  updateEventStatus: (eventId, status) => api.put(`/api/hod/events/${eventId}/status`, { status }),
  deleteEvent: (eventId) => api.delete(`/api/events/${eventId}`),

  // Club Requests
  approveClub: (id) => api.post(`/api/hod/club-requests/${id}/approve`),
  rejectClub: (id) => api.post(`/api/hod/club-requests/${id}/reject`),
  getClubRequests: (status) => api.get('/api/hod/club-requests', { params: { status } }),

  // Timetable
  createTimetable: (data) => api.post('/api/hod/timetable', data),
  getTimetable: (year, semester, division) => api.get('/api/hod/timetable', { params: { year, semester, division } }),
  updateTimetable: (id, data) => api.put(`/api/hod/timetable/${id}`, data),
  deleteTimetable: (id) => api.delete(`/api/hod/timetable/${id}`),
  deleteTimetableSlot: (id) => api.delete(`/api/hod/timetable/${id}`),
  generateAISuggestion: (data) => api.post('/api/hod/timetable/ai-suggest', data),
  publishTimetable: (slots) => api.post('/api/hod/timetable/publish', slots),
  archiveSemester: (year, semester, division) => api.put('/api/hod/timetable/archive', null, { params: { year, semester, division } }),
  getArchivedTimetable: () => api.get('/api/hod/timetable/archived'),

  // Professors (for timetable AI generation)
  getProfessors: () => api.get('/api/hod/professors'),

  // Seminar Halls
  createSeminarHall: (data) => api.post('/api/hod/seminar-halls', data),
  getSeminarHalls: () => api.get('/api/hod/seminar-halls'),

  // Broadcasts
  createBroadcast: (data) => api.post('/api/hod/broadcasts', data),
}

export default hodAPI
