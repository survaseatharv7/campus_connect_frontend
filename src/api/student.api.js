import api from './axios'

export const studentAPI = {
  // Events
  getEvents: () => api.get('/api/student/events'),
  getMyEvents: () => api.get('/api/student/events/my-registrations'),
  registerForEvent: (id) => api.post(`/api/student/events/${id}/register`),
  getTicketDetails: (id) => api.get(`/api/student/events/${id}/ticket`),

  // Clubs
  createClub: (data) => api.post('/api/student/clubs', data),
  getMyClubs: () => api.get('/api/student/clubs/my'),
  getAllClubs: () => api.get('/api/student/clubs'),
  joinClub: (id) => api.post(`/api/student/clubs/${id}/join`),

  // Submissions
  submitWork: (data) => api.post('/api/student/submissions', data),
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
}

export default studentAPI
