import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, GraduationCap } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { ROLE_DASHBOARD_PATHS } from '../../utils/constants'
import Button from '../ui/Button'

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#how-it-works' },
  { label: 'Modules', href: '#modules' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href) => {
    setMobileOpen(false)
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-dark-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                scrolled
                  ? 'bg-primary-600'
                  : 'bg-white/20 backdrop-blur'
              }`}
            >
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span
              className={`text-xl font-bold font-heading ${
                scrolled ? 'text-dark-900' : 'text-white'
              }`}
            >
              Campus<span className="text-accent-400">Nexus</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={`text-sm font-medium transition-colors ${
                  scrolled
                    ? 'text-dark-600 hover:text-primary-600'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(ROLE_DASHBOARD_PATHS[user?.role] || '/login')}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant={scrolled ? 'ghost' : 'ghost'}
                  size="sm"
                  onClick={() => navigate('/login')}
                  className={scrolled ? 'text-dark-700' : 'text-white hover:bg-white/10'}
                >
                  Login
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors ${
              scrolled
                ? 'text-dark-700 hover:bg-dark-100'
                : 'text-white hover:bg-white/10'
            }`}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white border-t border-dark-100 shadow-xl"
        >
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left px-4 py-3 rounded-xl text-dark-700 hover:bg-primary-50 hover:text-primary-600 font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
            <hr className="my-2 border-dark-100" />
            {isAuthenticated ? (
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate(ROLE_DASHBOARD_PATHS[user?.role] || '/login')}
              >
                Dashboard
              </Button>
            ) : (
              <div className="space-y-2">
                <Button variant="secondary" className="w-full" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button variant="accent" className="w-full" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
