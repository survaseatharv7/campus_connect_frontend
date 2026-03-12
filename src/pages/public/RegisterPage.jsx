import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  User, Mail, Phone, Lock, GraduationCap, ArrowRight, ArrowLeft,
  Shield, Building2, Users, BookOpen, CheckCircle,
} from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import useAuth from '../../hooks/useAuth'
import { ROLES, ROLE_LABELS } from '../../utils/constants'

const stepOneSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').optional().or(z.literal('')),
})

const stepTwoSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    role: z.string().min(1, 'Please select a role'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const roleOptions = [
  { value: ROLES.PRINCIPAL, label: 'Principal', icon: Building2, color: 'from-purple-500 to-purple-700' },
  { value: ROLES.HOD, label: 'HOD', icon: Users, color: 'from-teal-500 to-teal-700' },
  { value: ROLES.PROFESSOR, label: 'Professor', icon: BookOpen, color: 'from-orange-500 to-orange-700' },
  { value: ROLES.STUDENT, label: 'Student', icon: GraduationCap, color: 'from-emerald-500 to-emerald-700' },
]

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const { register: registerUser } = useAuth()

  const stepOneForm = useForm({
    resolver: zodResolver(stepOneSchema),
    defaultValues: { name: '', email: '', phone: '' },
  })

  const stepTwoForm = useForm({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: { password: '', confirmPassword: '', role: '' },
  })

  const handleStepOne = (data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setStep(2)
  }

  const handleStepTwo = (data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setStep(3)
  }

  const handleFinalSubmit = async () => {
    setLoading(true)
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      password: formData.password,
      role: formData.role,
    }
    await registerUser(payload)
    setLoading(false)
  }

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 200 : -200, opacity: 0 }),
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-24 right-20 text-accent-400 text-4xl opacity-40"
        >
          ★
        </motion.div>

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-8"
          >
            <GraduationCap className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-4xl font-bold font-heading text-white mb-4">
            Join <span className="text-accent-400">CampusNexus</span>
          </h2>
          <p className="text-white/60 max-w-sm mx-auto mb-12">
            Create your account and start managing your campus experience today.
          </p>

          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    step >= s
                      ? 'bg-accent-400 text-dark'
                      : 'bg-white/10 text-white/40'
                  }`}
                >
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-0.5 ${
                      step > s ? 'bg-accent-400' : 'bg-white/20'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-8 mt-3 text-xs text-white/50">
            <span>Personal</span>
            <span>Account</span>
            <span>Review</span>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-surface-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo + Progress */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold font-heading text-dark-900">
                Campus<span className="text-accent-400">Nexus</span>
              </span>
            </div>
            {/* Progress bar */}
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-1.5 rounded-full transition-colors ${
                    step >= s ? 'bg-primary-600' : 'bg-dark-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait" custom={step}>
            {/* ── Step 1: Personal Info ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold font-heading text-dark-900 mb-2">
                  Personal Info
                </h1>
                <p className="text-dark-500 mb-8">Let&apos;s start with your basic details</p>

                <form onSubmit={stepOneForm.handleSubmit(handleStepOne)} className="space-y-5">
                  <Input
                    label="Full Name"
                    icon={User}
                    placeholder="John Doe"
                    error={stepOneForm.formState.errors.name?.message}
                    {...stepOneForm.register('name')}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    icon={Mail}
                    placeholder="you@example.com"
                    error={stepOneForm.formState.errors.email?.message}
                    {...stepOneForm.register('email')}
                  />
                  <Input
                    label="Phone Number (Optional)"
                    icon={Phone}
                    placeholder="9876543210"
                    error={stepOneForm.formState.errors.phone?.message}
                    {...stepOneForm.register('phone')}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Continue
                  </Button>
                </form>
              </motion.div>
            )}

            {/* ── Step 2: Account Setup ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={2}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold font-heading text-dark-900 mb-2">
                  Account Setup
                </h1>
                <p className="text-dark-500 mb-8">Set password and select your role</p>

                <form onSubmit={stepTwoForm.handleSubmit(handleStepTwo)} className="space-y-5">
                  <Input
                    label="Password"
                    type="password"
                    icon={Lock}
                    placeholder="Min 6 characters"
                    error={stepTwoForm.formState.errors.password?.message}
                    {...stepTwoForm.register('password')}
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    icon={Lock}
                    placeholder="Re-enter password"
                    error={stepTwoForm.formState.errors.confirmPassword?.message}
                    {...stepTwoForm.register('confirmPassword')}
                  />

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-3">
                      Select Your Role
                    </label>
                    {stepTwoForm.formState.errors.role?.message && (
                      <p className="text-sm text-red-500 mb-2">
                        {stepTwoForm.formState.errors.role.message}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      {roleOptions.map((r) => {
                        const isSelected = stepTwoForm.watch('role') === r.value
                        return (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => stepTwoForm.setValue('role', r.value, { shouldValidate: true })}
                            className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                              isSelected
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-dark-200 hover:border-dark-300 bg-white'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle className="w-5 h-5 text-primary-600" />
                              </div>
                            )}
                            <r.icon
                              className={`w-6 h-6 mb-2 ${
                                isSelected ? 'text-primary-600' : 'text-dark-400'
                              }`}
                            />
                            <p
                              className={`text-sm font-semibold ${
                                isSelected ? 'text-primary-700' : 'text-dark-700'
                              }`}
                            >
                              {r.label}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      size="lg"
                      onClick={() => setStep(1)}
                      icon={ArrowLeft}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      icon={ArrowRight}
                      iconPosition="right"
                      className="flex-1"
                    >
                      Continue
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ── Step 3: Review & Submit ── */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={3}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold font-heading text-dark-900 mb-2">
                  Review & Submit
                </h1>
                <p className="text-dark-500 mb-8">Please confirm your details</p>

                <div className="bg-white rounded-2xl p-6 border border-dark-100 space-y-4 mb-8">
                  <div className="flex items-center justify-between py-2 border-b border-dark-50">
                    <span className="text-sm text-dark-500">Name</span>
                    <span className="text-sm font-medium text-dark-900">{formData.name}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-dark-50">
                    <span className="text-sm text-dark-500">Email</span>
                    <span className="text-sm font-medium text-dark-900">{formData.email}</span>
                  </div>
                  {formData.phone && (
                    <div className="flex items-center justify-between py-2 border-b border-dark-50">
                      <span className="text-sm text-dark-500">Phone</span>
                      <span className="text-sm font-medium text-dark-900">{formData.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-dark-500">Role</span>
                    <span className="text-sm font-medium text-primary-600">
                      {ROLE_LABELS[formData.role]}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setStep(2)}
                    icon={ArrowLeft}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleFinalSubmit}
                    loading={loading}
                    icon={CheckCircle}
                    iconPosition="right"
                    className="flex-1"
                  >
                    Create Account
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-8 text-center text-sm text-dark-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
