import api from './axios'

export const studentAPI = {
  // Events
  getEvents: () => api.get('/api/student/events'),
  getMyRegistrations: () => api.get('/api/student/events/my-registrations'),
  registerForEvent: (id) => api.post(`/api/student/events/${id}/register`),
  getTicketDetails: (id) => api.get(`/api/student/events/${id}/ticket`),
  getEventParticipants: (eventId) => api.get(`/api/student/events/${eventId}/participants`),
  updateEventStatus: (eventId, status) => api.put(`/api/student/events/${eventId}/status`, { status }),

  // Clubs
  createClub: (data) => api.post('/api/student/clubs', data),
  getAllClubs: () => api.get('/api/student/clubs'),
  joinClub: (id) => api.post(`/api/student/clubs/${id}/join`),

  // Submissions
  submitWork: (sectionId, data) => api.post(`/api/student/submissions/${sectionId}`, data),
  getMySubmissions: () => api.get('/api/student/submissions'),

  // Notes
  getNotes: () => api.get('/api/student/notes'),

  // Broadcasts
  getBroadcasts: () => api.get('/api/student/broadcasts'),

  // Timetable
  getTimetable: () => api.get('/api/student/timetable'),

  // Teacher Availability
  getTeacherAvailability: () => api.get('/api/student/teacher-availability'),

  // Progress
  getMyProgress: () => api.get('/api/student/progress'),

  // Profile
  updateProfile: (data) => api.put('/api/student/profile', data),

  // Sections
  getSections: () => api.get('/api/student/sections'),

  // Professors
  getProfessors: () => api.get('/api/student/professors'),

  // Students
  getStudents: () => api.get('/api/student/students'),
}

export default studentAPI
