import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, GraduationCap, ArrowRight } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import useAuth from '../../hooks/useAuth'
import { ROLE_LABELS } from '../../utils/constants'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const roles = ['CAMPUS_ADMIN', 'PRINCIPAL', 'HOD', 'PROFESSOR', 'STUDENT']

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('STUDENT')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    await login(data.email, data.password)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Gradient */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        {/* Floating decorative */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-16 text-accent-400 text-4xl opacity-40"
        >
          ★
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-32 right-16 text-accent-400 text-3xl opacity-50"
        >
          ✦
        </motion.div>

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-8"
          >
            <GraduationCap className="w-12 h-12 text-white" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold font-heading text-white mb-4"
          >
            Welcome to <span className="text-accent-400">CampusNexus</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/60 max-w-sm mx-auto"
          >
            Your complete campus management solution. Login to access your personalized dashboard.
          </motion.p>

          {/* Floating Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 max-w-xs mx-auto"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500'].map((c, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-white/20`} />
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">2k+ Users</p>
                <p className="text-xs text-white/50">Active on platform</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-surface-50">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold font-heading text-dark-900">
              Campus<span className="text-accent-400">Nexus</span>
            </span>
          </div>

          <h1 className="text-3xl font-bold font-heading text-dark-900 mb-2">Welcome Back</h1>
          <p className="text-dark-500 mb-8">Enter your credentials to access your dashboard</p>

          {/* Role Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedRole === role
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-dark-100 text-dark-500 hover:bg-dark-200'
                }`}
              >
                {ROLE_LABELS[role]}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-dark-500">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-dark-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
