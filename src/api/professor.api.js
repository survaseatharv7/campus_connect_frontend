import api from './axios'

export const professorAPI = {
  // Batches
  createBatch: (data) => api.post('/api/professor/batches', data),
  getBatches: () => api.get('/api/professor/batches'),

  // Sections
  createSection: (batchId, data) => api.post(`/api/professor/batches/${batchId}/sections`, data),
  getSections: (batchId) => api.get(`/api/professor/batches/${batchId}/sections`),

  // Submissions
  getSubmissions: () => api.get('/api/professor/submissions'),
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

  // Events
  createEvent: (data) => api.post('/api/professor/events', data),
  getEvents: () => api.get('/api/professor/events'),

  // Student Progress
  getStudentProgress: () => api.get('/api/professor/student-progress'),
  updateProgress: (id, data) => api.post(`/api/professor/student-progress/${id}`, data),
}

export default professorAPI
