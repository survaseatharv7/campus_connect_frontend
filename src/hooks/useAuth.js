import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { authAPI } from '../api/auth.api'
import { ROLE_DASHBOARD_PATHS } from '../utils/constants'
import toast from 'react-hot-toast'

export function useAuth() {
  const navigate = useNavigate()
  const { user, isAuthenticated, login: storeLogin, logout: storeLogout } = useAuthStore()

  const login = useCallback(
    async (email, password) => {
      try {
        const res = await authAPI.login({ email, password })
        const data = res.data.data || res.data

        const userData = {
          id: data.userId || data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          collegeId: data.collegeId,
          departmentId: data.departmentId,
          profilePicUrl: data.profilePicUrl,
        }

        storeLogin(userData, data.accessToken, data.refreshToken)
        toast.success(`Welcome back, ${userData.name}!`)

        const dashboardPath = ROLE_DASHBOARD_PATHS[userData.role] || '/login'
        navigate(dashboardPath, { replace: true })

        return { success: true }
      } catch (error) {
        const message = error.response?.data?.message || 'Login failed. Please try again.'
        toast.error(message)
        return { success: false, error: message }
      }
    },
    [storeLogin, navigate]
  )

  const register = useCallback(
    async (formData) => {
      try {
        await authAPI.register(formData)
        toast.success('Registration successful! Please login.')
        navigate('/login', { replace: true })
        return { success: true }
      } catch (error) {
        const message = error.response?.data?.message || 'Registration failed. Please try again.'
        toast.error(message)
        return { success: false, error: message }
      }
    },
    [navigate]
  )

  const logout = useCallback(async () => {
    try {
      await authAPI.logout()
    } catch {
      // Ignore logout API errors
    } finally {
      storeLogout()
      toast.success('Logged out successfully')
      navigate('/login', { replace: true })
    }
  }, [storeLogout, navigate])

  return {
    user,
    isAuthenticated,
    role: user?.role,
    login,
    register,
    logout,
  }
}

export default useAuth
