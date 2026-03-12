export const ROLES = {
  CAMPUS_ADMIN: 'CAMPUS_ADMIN',
  PRINCIPAL: 'PRINCIPAL',
  HOD: 'HOD',
  PROFESSOR: 'PROFESSOR',
  STUDENT: 'STUDENT',
}

export const ROLE_LABELS = {
  CAMPUS_ADMIN: 'Campus Admin',
  PRINCIPAL: 'Principal',
  HOD: 'Head of Department',
  PROFESSOR: 'Professor',
  STUDENT: 'Student',
}

export const ROLE_DASHBOARD_PATHS = {
  CAMPUS_ADMIN: '/admin/dashboard',
  PRINCIPAL: '/principal/dashboard',
  HOD: '/hod/dashboard',
  PROFESSOR: '/professor/dashboard',
  STUDENT: '/student/dashboard',
}

export const EVENT_STATUS_COLORS = {
  UPCOMING: 'blue',
  ONGOING: 'green',
  COMPLETED: 'gray',
  CANCELLED: 'red',
}

export const CLUB_STATUS_COLORS = {
  PENDING_HOD: 'yellow',
  PENDING_PRINCIPAL: 'orange',
  APPROVED: 'green',
  REJECTED: 'red',
}

export const SUBMISSION_STATUS_COLORS = {
  SUBMITTED: 'blue',
  UNDER_REVIEW: 'yellow',
  APPROVED: 'green',
  REJECTED: 'red',
}

export const COLLEGE_STATUS_COLORS = {
  PENDING: 'yellow',
  ACTIVE: 'green',
  INACTIVE: 'gray',
}

export const PAYMENT_STATUS_COLORS = {
  PENDING: 'yellow',
  SUCCESS: 'green',
  FAILED: 'red',
}

export const TICKET_STATUS_COLORS = {
  PENDING: 'yellow',
  CONFIRMED: 'green',
  CANCELLED: 'red',
}

export const HALL_STATUS_COLORS = {
  AVAILABLE: 'green',
  BOOKED: 'blue',
  MAINTENANCE: 'yellow',
}

export const AVAILABILITY_STATUS_COLORS = {
  AVAILABLE: 'green',
  BUSY: 'red',
  ON_LEAVE: 'gray',
}

export const BROADCAST_LEVEL_COLORS = {
  CAMPUS: 'purple',
  COLLEGE: 'blue',
  DEPARTMENT: 'teal',
}

export const EVENT_LEVEL_COLORS = {
  CAMPUS: 'purple',
  COLLEGE: 'blue',
  DEPARTMENT: 'teal',
  CLUB: 'orange',
}

export const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
]

export const YEARS = [
  { value: 1, label: '1st Year' },
  { value: 2, label: '2nd Year' },
  { value: 3, label: '3rd Year' },
  { value: 4, label: '4th Year' },
]

export const ACADEMIC_YEARS = [
  '2024-2025', '2025-2026', '2026-2027', '2027-2028',
]

export const SEMESTERS = [
  { value: 1, label: 'Semester 1' },
  { value: 2, label: 'Semester 2' },
  { value: 3, label: 'Semester 3' },
  { value: 4, label: 'Semester 4' },
  { value: 5, label: 'Semester 5' },
  { value: 6, label: 'Semester 6' },
  { value: 7, label: 'Semester 7' },
  { value: 8, label: 'Semester 8' },
]
