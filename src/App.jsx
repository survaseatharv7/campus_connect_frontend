import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ROLES } from './utils/constants'
import ProtectedRoute from './components/shared/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'
import Spinner from './components/ui/Spinner'

// ─── Public Pages ───
const LandingPage = lazy(() => import('./pages/public/LandingPage'))
const LoginPage = lazy(() => import('./pages/public/LoginPage'))
const RegisterPage = lazy(() => import('./pages/public/RegisterPage'))

// ─── Admin Pages ───
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminColleges = lazy(() => import('./pages/admin/CollegesPage'))
const AdminEvents = lazy(() => import('./pages/admin/EventsPage'))
const AdminBroadcast = lazy(() => import('./pages/admin/BroadcastPage'))
const AdminSeminarHalls = lazy(() => import('./pages/admin/SeminarHallsPage'))

// ─── Principal Pages ───
const PrincipalDashboard = lazy(() => import('./pages/principal/PrincipalDashboard'))
const PrincipalDepartments = lazy(() => import('./pages/principal/DepartmentsPage'))
const PrincipalProfessors = lazy(() => import('./pages/principal/ProfessorsPage'))
const PrincipalClubRequests = lazy(() => import('./pages/principal/ClubRequestsPage'))
const PrincipalSeminarHalls = lazy(() => import('./pages/principal/SeminarHallsPage'))
const PrincipalEvents = lazy(() => import('./pages/principal/EventsPage'))
const PrincipalBroadcast = lazy(() => import('./pages/principal/BroadcastPage'))

// ─── HOD Pages ───
const HODDashboard = lazy(() => import('./pages/hod/HODDashboard'))
const HODTimetable = lazy(() => import('./pages/hod/TimetablePage'))
const HODClubRequests = lazy(() => import('./pages/hod/ClubRequestsPage'))
const HODSeminarHalls = lazy(() => import('./pages/hod/SeminarHallsPage'))
const HODEvents = lazy(() => import('./pages/hod/EventsPage'))
const HODBroadcast = lazy(() => import('./pages/hod/BroadcastPage'))

// ─── Professor Pages ───
const ProfessorDashboard = lazy(() => import('./pages/professor/ProfessorDashboard'))
const ProfessorBatches = lazy(() => import('./pages/professor/BatchesPage'))
const ProfessorSubmissions = lazy(() => import('./pages/professor/SubmissionsPage'))
const ProfessorNotes = lazy(() => import('./pages/professor/NotesPage'))
const ProfessorAvailability = lazy(() => import('./pages/professor/AvailabilityPage'))
const ProfessorEvents = lazy(() => import('./pages/professor/EventsPage'))
const ProfessorProgress = lazy(() => import('./pages/professor/ProgressPage'))

// ─── Student Pages ───
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'))
const StudentEvents = lazy(() => import('./pages/student/EventsPage'))
const StudentClubs = lazy(() => import('./pages/student/ClubsPage'))
const StudentTimetable = lazy(() => import('./pages/student/TimetablePage'))
const StudentNotes = lazy(() => import('./pages/student/NotesPage'))
const StudentSubmissions = lazy(() => import('./pages/student/SubmissionsPage'))
const StudentProgress = lazy(() => import('./pages/student/ProgressPage'))
const StudentBroadcast = lazy(() => import('./pages/student/BroadcastPage'))

// ─── Loading Fallback ───
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <Spinner size="lg" />
    </div>
  )
}

// ─── Helper: wrap dashboard pages ───
function DashboardPage({ children, allowedRoles }) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ═══════ PUBLIC ═══════ */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ═══════ CAMPUS ADMIN ═══════ */}
        <Route path="/admin/dashboard" element={<DashboardPage allowedRoles={[ROLES.CAMPUS_ADMIN]}><AdminDashboard /></DashboardPage>} />
        <Route path="/admin/colleges" element={<DashboardPage allowedRoles={[ROLES.CAMPUS_ADMIN]}><AdminColleges /></DashboardPage>} />
        <Route path="/admin/events" element={<DashboardPage allowedRoles={[ROLES.CAMPUS_ADMIN]}><AdminEvents /></DashboardPage>} />
        <Route path="/admin/broadcasts" element={<DashboardPage allowedRoles={[ROLES.CAMPUS_ADMIN]}><AdminBroadcast /></DashboardPage>} />
        <Route path="/admin/seminar-halls" element={<DashboardPage allowedRoles={[ROLES.CAMPUS_ADMIN]}><AdminSeminarHalls /></DashboardPage>} />

        {/* ═══════ PRINCIPAL ═══════ */}
        <Route path="/principal/dashboard" element={<DashboardPage allowedRoles={[ROLES.PRINCIPAL]}><PrincipalDashboard /></DashboardPage>} />
        <Route path="/principal/departments" element={<DashboardPage allowedRoles={[ROLES.PRINCIPAL]}><PrincipalDepartments /></DashboardPage>} />
        <Route path="/principal/professors" element={<DashboardPage allowedRoles={[ROLES.PRINCIPAL]}><PrincipalProfessors /></DashboardPage>} />
        <Route path="/principal/club-requests" element={<DashboardPage allowedRoles={[ROLES.PRINCIPAL]}><PrincipalClubRequests /></DashboardPage>} />
        <Route path="/principal/seminar-halls" element={<DashboardPage allowedRoles={[ROLES.PRINCIPAL]}><PrincipalSeminarHalls /></DashboardPage>} />
        <Route path="/principal/events" element={<DashboardPage allowedRoles={[ROLES.PRINCIPAL]}><PrincipalEvents /></DashboardPage>} />
        <Route path="/principal/broadcasts" element={<DashboardPage allowedRoles={[ROLES.PRINCIPAL]}><PrincipalBroadcast /></DashboardPage>} />

        {/* ═══════ HOD ═══════ */}
        <Route path="/hod/dashboard" element={<DashboardPage allowedRoles={[ROLES.HOD]}><HODDashboard /></DashboardPage>} />
        <Route path="/hod/timetable" element={<DashboardPage allowedRoles={[ROLES.HOD]}><HODTimetable /></DashboardPage>} />
        <Route path="/hod/club-requests" element={<DashboardPage allowedRoles={[ROLES.HOD]}><HODClubRequests /></DashboardPage>} />
        <Route path="/hod/seminar-halls" element={<DashboardPage allowedRoles={[ROLES.HOD]}><HODSeminarHalls /></DashboardPage>} />
        <Route path="/hod/events" element={<DashboardPage allowedRoles={[ROLES.HOD]}><HODEvents /></DashboardPage>} />
        <Route path="/hod/broadcasts" element={<DashboardPage allowedRoles={[ROLES.HOD]}><HODBroadcast /></DashboardPage>} />

        {/* ═══════ PROFESSOR ═══════ */}
        <Route path="/professor/dashboard" element={<DashboardPage allowedRoles={[ROLES.PROFESSOR]}><ProfessorDashboard /></DashboardPage>} />
        <Route path="/professor/batches" element={<DashboardPage allowedRoles={[ROLES.PROFESSOR]}><ProfessorBatches /></DashboardPage>} />
        <Route path="/professor/submissions" element={<DashboardPage allowedRoles={[ROLES.PROFESSOR]}><ProfessorSubmissions /></DashboardPage>} />
        <Route path="/professor/notes" element={<DashboardPage allowedRoles={[ROLES.PROFESSOR]}><ProfessorNotes /></DashboardPage>} />
        <Route path="/professor/availability" element={<DashboardPage allowedRoles={[ROLES.PROFESSOR]}><ProfessorAvailability /></DashboardPage>} />
        <Route path="/professor/events" element={<DashboardPage allowedRoles={[ROLES.PROFESSOR]}><ProfessorEvents /></DashboardPage>} />
        <Route path="/professor/progress" element={<DashboardPage allowedRoles={[ROLES.PROFESSOR]}><ProfessorProgress /></DashboardPage>} />

        {/* ═══════ STUDENT ═══════ */}
        <Route path="/student/dashboard" element={<DashboardPage allowedRoles={[ROLES.STUDENT]}><StudentDashboard /></DashboardPage>} />
        <Route path="/student/events" element={<DashboardPage allowedRoles={[ROLES.STUDENT]}><StudentEvents /></DashboardPage>} />
        <Route path="/student/clubs" element={<DashboardPage allowedRoles={[ROLES.STUDENT]}><StudentClubs /></DashboardPage>} />
        <Route path="/student/timetable" element={<DashboardPage allowedRoles={[ROLES.STUDENT]}><StudentTimetable /></DashboardPage>} />
        <Route path="/student/notes" element={<DashboardPage allowedRoles={[ROLES.STUDENT]}><StudentNotes /></DashboardPage>} />
        <Route path="/student/submissions" element={<DashboardPage allowedRoles={[ROLES.STUDENT]}><StudentSubmissions /></DashboardPage>} />
        <Route path="/student/progress" element={<DashboardPage allowedRoles={[ROLES.STUDENT]}><StudentProgress /></DashboardPage>} />
        <Route path="/student/broadcasts" element={<DashboardPage allowedRoles={[ROLES.STUDENT]}><StudentBroadcast /></DashboardPage>} />

        {/* ═══════ CATCH ALL ═══════ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
