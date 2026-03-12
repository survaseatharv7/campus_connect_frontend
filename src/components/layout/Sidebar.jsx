import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Building2, Users, Calendar, Megaphone,
  School, UserCheck, ClipboardList, BookOpen, Clock, GraduationCap,
  FileText, BarChart3, Award, Bookmark, ChevronLeft, LogOut,
  X, DoorOpen,
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import useUIStore from '../../store/uiStore'
import { ROLES, ROLE_LABELS } from '../../utils/constants'
import { getInitials } from '../../utils/formatters'
import useAuth from '../../hooks/useAuth'

const navItemsByRole = {
  [ROLES.CAMPUS_ADMIN]: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Colleges', path: '/admin/colleges', icon: Building2 },
    { label: 'Seminar Halls', path: '/admin/seminar-halls', icon: DoorOpen },
    { label: 'Events', path: '/admin/events', icon: Calendar },
    { label: 'Broadcasts', path: '/admin/broadcasts', icon: Megaphone },
  ],
  [ROLES.PRINCIPAL]: [
    { label: 'Dashboard', path: '/principal/dashboard', icon: LayoutDashboard },
    { label: 'Departments', path: '/principal/departments', icon: School },
    { label: 'Professors', path: '/principal/professors', icon: Users },
    { label: 'Club Requests', path: '/principal/club-requests', icon: Award },
    { label: 'Seminar Halls', path: '/principal/seminar-halls', icon: DoorOpen },
    { label: 'Events', path: '/principal/events', icon: Calendar },
    { label: 'Broadcasts', path: '/principal/broadcasts', icon: Megaphone },
  ],
  [ROLES.HOD]: [
    { label: 'Dashboard', path: '/hod/dashboard', icon: LayoutDashboard },
    { label: 'Timetable', path: '/hod/timetable', icon: Clock },
    { label: 'Club Requests', path: '/hod/club-requests', icon: Award },
    { label: 'Seminar Halls', path: '/hod/seminar-halls', icon: DoorOpen },
    { label: 'Events', path: '/hod/events', icon: Calendar },
    { label: 'Broadcasts', path: '/hod/broadcasts', icon: Megaphone },
  ],
  [ROLES.PROFESSOR]: [
    { label: 'Dashboard', path: '/professor/dashboard', icon: LayoutDashboard },
    { label: 'Batches', path: '/professor/batches', icon: BookOpen },
    { label: 'Submissions', path: '/professor/submissions', icon: ClipboardList },
    { label: 'Notes', path: '/professor/notes', icon: FileText },
    { label: 'Availability', path: '/professor/availability', icon: Clock },
    { label: 'Events', path: '/professor/events', icon: Calendar },
    { label: 'Progress', path: '/professor/progress', icon: BarChart3 },
  ],
  [ROLES.STUDENT]: [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Events', path: '/student/events', icon: Calendar },
    { label: 'My Clubs', path: '/student/clubs', icon: Award },
    { label: 'Timetable', path: '/student/timetable', icon: Clock },
    { label: 'Notes', path: '/student/notes', icon: FileText },
    { label: 'Submissions', path: '/student/submissions', icon: ClipboardList },
    { label: 'Progress', path: '/student/progress', icon: BarChart3 },
    { label: 'Broadcasts', path: '/student/broadcasts', icon: Megaphone },
  ],
}

export default function Sidebar() {
  const { user } = useAuthStore()
  const { sidebarOpen, toggleSidebar, sidebarMobileOpen, setMobileSidebarOpen } = useUIStore()
  const { logout } = useAuth()
  const location = useLocation()

  const navItems = navItemsByRole[user?.role] || []
  const initials = getInitials(user?.name)

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-dark-100 z-50 flex flex-col transition-all duration-300 ${
          sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        animate={{ width: sidebarOpen ? 280 : 72 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo + Collapse */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-dark-100">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold font-heading text-dark-900">
                Campus<span className="text-accent-400">Nexus</span>
              </span>
            </motion.div>
          )}
          <button
            onClick={() => {
              toggleSidebar()
              if (sidebarMobileOpen) setMobileSidebarOpen(false)
            }}
            className="p-2 rounded-xl text-dark-400 hover:text-dark-600 hover:bg-dark-50 transition-colors hidden lg:flex"
          >
            <ChevronLeft
              className={`w-5 h-5 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`}
            />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-2 rounded-xl text-dark-400 hover:text-dark-600 hover:bg-dark-50 transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className={`px-4 py-4 border-b border-dark-100 ${!sidebarOpen && 'flex justify-center'}`}>
          <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {initials}
            </div>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
                <p className="text-sm font-semibold text-dark-900 truncate">{user?.name}</p>
                <p className="text-xs text-dark-400 truncate">{ROLE_LABELS[user?.role]}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 relative group ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-dark-500 hover:bg-dark-50 hover:text-dark-700'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-600 rounded-r-full"
                  />
                )}
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-dark-400 group-hover:text-dark-600'}`} />
                {sidebarOpen && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {item.label}
                  </motion.span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-3 py-4 border-t border-dark-100">
          <button
            onClick={logout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all ${
              !sidebarOpen && 'justify-center'
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>
    </>
  )
}
