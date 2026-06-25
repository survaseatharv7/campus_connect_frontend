import api from './axios';

export const externalAPI = {
  getEvents: () => api.get('/api/external/events'),
  registerGuest: (eventId, data) => api.post(`/api/external/events/${eventId}/register`, data),
  getMyRegistrations: (email) => api.get(`/api/external/registrations`, { params: { email } }),
};
