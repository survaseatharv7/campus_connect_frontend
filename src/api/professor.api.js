import api from './axios'

export const professorAPI = {
  // Batches
  createBatch: (data) => api.post('/api/professor/batches', data),
  getBatches: () => api.get('/api/professor/batches'),
  updateBatch: (id, data) => api.put(`/api/professor/batches/${id}`, data),
  deleteBatch: (id) => api.delete(`/api/professor/batches/${id}`),

  // Sections
  createSection: (batchId, data) => api.post(`/api/professor/batches/${batchId}/sections`, data),
  getSections: (batchId) => api.get(`/api/professor/batches/${batchId}/sections`),
  updateSection: (id, data) => api.put(`/api/professor/sections/${id}`, data),
  deleteSection: (id) => api.delete(`/api/professor/sections/${id}`),

  // Submissions
  getSubmissions: (sectionId) => api.get(`/api/professor/submissions/${sectionId}`),
  addRemark: (id, data) => api.put(`/api/professor/submissions/${id}/remark`, data),

  // Notes
  uploadNote: (data) => api.post('/api/professor/notes', data),
  getNotes: () => api.get('/api/professor/notes'),
  updateNote: (id, data) => api.put(`/api/professor/notes/${id}`, data),
  deleteNote: (id) => api.delete(`/api/professor/notes/${id}`),

  // Availability
  markAvailability: (data) => api.post('/api/professor/availability', data),
  getAvailability: () => api.get('/api/professor/availability'),
  updateAvailability: (id, data) => api.put(`/api/professor/availability/${id}`, data),
  deleteAvailability: (id) => api.delete(`/api/professor/availability/${id}`),

  // Events
  createEvent: (data) => api.post('/api/professor/events', data),
  getEvents: () => api.get('/api/professor/events'),
  getEventParticipants: (eventId) => api.get(`/api/professor/events/${eventId}/participants`),
  updateEventStatus: (eventId, status) => api.put(`/api/professor/events/${eventId}/status`, { status }),
  deleteEvent: (eventId) => api.delete(`/api/events/${eventId}`),

  // Student Progress
  getStudentProgress: (studentId) => api.get(`/api/professor/student-progress/${studentId}`),
  updateProgress: (id, data) => api.post(`/api/professor/student-progress/${id}`, data),

  // Timetable
  getMyTimetable: () => api.get('/api/professor/timetable'),
}

export default professorAPI
