import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { ROLE_DASHBOARD_PATHS } from '../../utils/constants'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const dashboardPath = ROLE_DASHBOARD_PATHS[user?.role] || '/login'
    return <Navigate to={dashboardPath} replace />
  }

  return children
}
