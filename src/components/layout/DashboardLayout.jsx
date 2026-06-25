import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'
import useUIStore from '../../store/uiStore'
import useAuthStore from '../../store/authStore'
import { getInitials } from '../../utils/formatters'
import { ROLE_LABELS } from '../../utils/constants'

export default function DashboardLayout({ children }) {
  const { sidebarOpen, setMobileSidebarOpen } = useUIStore()
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-surface-50">
      <Sidebar />

      {/* Main Content Area */}
      <div
        className="transition-all duration-300"
        style={{ marginLeft: `${sidebarOpen ? 280 : 72}px` }}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-dark-100 h-16">
          <div className="flex items-center justify-between h-full px-6">
            {/* Left: Hamburger + Page info */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 rounded-xl text-dark-400 hover:text-dark-600 hover:bg-dark-50 transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:block">
                <p className="text-sm text-dark-400">
                  Welcome back, <span className="font-medium text-dark-700">{user?.name}</span>
                </p>
              </div>
            </div>

            {/* Right: Avatar */}
            <div className="flex items-center gap-3">
              {/* User Avatar */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-dark-900">{user?.name}</p>
                  <p className="text-xs text-dark-400">{ROLE_LABELS[user?.role]}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-sm">
                  {getInitials(user?.name)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 min-h-[calc(100vh-4rem)]">
          <div className="page-transition">{children}</div>
        </main>
      </div>

      {/* Mobile sidebar margin override */}
      <style>{`
        @media (max-width: 1023px) {
          .min-h-screen > div:nth-child(2) {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
