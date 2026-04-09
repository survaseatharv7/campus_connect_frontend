import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  User, Mail, Phone, Lock, GraduationCap, ArrowRight, ArrowLeft,
  Building2, Users, BookOpen, CheckCircle, ChevronDown,
} from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import useAuth from '../../hooks/useAuth'
import authAPI from '../../api/auth.api'
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
  { value: ROLES.PRINCIPAL, label: 'Principal', icon: Building2 },
  { value: ROLES.HOD, label: 'HOD', icon: Users },
  { value: ROLES.PROFESSOR, label: 'Professor', icon: BookOpen },
  { value: ROLES.STUDENT, label: 'Student', icon: GraduationCap },
]

// Roles that need college selection
const NEEDS_COLLEGE = [ROLES.PRINCIPAL, ROLES.HOD, ROLES.PROFESSOR, ROLES.STUDENT]
// Roles that also need department selection
const NEEDS_DEPARTMENT = [ROLES.HOD, ROLES.PROFESSOR, ROLES.STUDENT]

const TOTAL_STEPS = 4

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)

  // College & department dropdown data
  const [colleges, setColleges] = useState([])
  const [departments, setDepartments] = useState([])
  const [collegesLoading, setCollegesLoading] = useState(false)
  const [departmentsLoading, setDepartmentsLoading] = useState(false)
  const [selectedCollegeId, setSelectedCollegeId] = useState('')
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('')
  const [collegeError, setCollegeError] = useState('')
  const [departmentError, setDepartmentError] = useState('')

  const { register: registerUser } = useAuth()

  const stepOneForm = useForm({
    resolver: zodResolver(stepOneSchema),
    defaultValues: { name: '', email: '', phone: '' },
  })

  const stepTwoForm = useForm({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: { password: '', confirmPassword: '', role: '' },
  })

  // Fetch colleges when step 3 is reached
  useEffect(() => {
    if (step === 3 && colleges.length === 0) {
      setCollegesLoading(true)
      authAPI.getColleges()
        .then((r) => {
          const list = Array.isArray(r.data.data) ? r.data.data : []
          setColleges(list)
        })
        .catch(() => setCollegeError('Failed to load colleges. Please try again.'))
        .finally(() => setCollegesLoading(false))
    }
  }, [step])

  // Fetch departments when a college is selected (only for roles that need department)
  useEffect(() => {
    if (!selectedCollegeId) {
      setDepartments([])
      setSelectedDepartmentId('')
      return
    }
    if (!NEEDS_DEPARTMENT.includes(formData.role)) return

    setDepartmentsLoading(true)
    setSelectedDepartmentId('')
    authAPI.getDepartmentsByCollege(selectedCollegeId)
      .then((r) => {
        const list = Array.isArray(r.data.data) ? r.data.data : []
        setDepartments(list)
      })
      .catch(() => setDepartmentError('Failed to load departments. Please try again.'))
      .finally(() => setDepartmentsLoading(false))
  }, [selectedCollegeId])

  const handleStepOne = (data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setStep(2)
  }

  const handleStepTwo = (data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    // Reset college/dept if role changed
    setSelectedCollegeId('')
    setSelectedDepartmentId('')
    setDepartments([])
    setStep(3)
  }

  const handleStepThree = () => {
    // Validate college selection
    if (!selectedCollegeId) {
      setCollegeError('Please select a college.')
      return
    }
    // Validate department selection for roles that need it
    if (NEEDS_DEPARTMENT.includes(formData.role) && !selectedDepartmentId) {
      setDepartmentError('Please select a department.')
      return
    }
    setCollegeError('')
    setDepartmentError('')
    setFormData((prev) => ({
      ...prev,
      collegeId: selectedCollegeId,
      departmentId: NEEDS_DEPARTMENT.includes(formData.role) ? selectedDepartmentId : null,
      collegeName: colleges.find((c) => c.id === selectedCollegeId)?.name || '',
      departmentName: departments.find((d) => d.id === selectedDepartmentId)?.name || '',
    }))
    setStep(4)
  }

  const handleFinalSubmit = async () => {
    setLoading(true)
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      password: formData.password,
      role: formData.role,
      collegeId: formData.collegeId || null,
      departmentId: formData.departmentId || null,
    }
    await registerUser(payload)
    setLoading(false)
  }

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 200 : -200, opacity: 0 }),
  }

  const needsDepartment = NEEDS_DEPARTMENT.includes(formData.role)

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
          <div className="flex items-center justify-center gap-3">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
              const s = i + 1
              return (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${step >= s ? 'bg-accent-400 text-dark' : 'bg-white/10 text-white/40'
                      }`}
                  >
                    {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                  </div>
                  {s < TOTAL_STEPS && (
                    <div className={`w-8 h-0.5 ${step > s ? 'bg-accent-400' : 'bg-white/20'}`} />
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex justify-center gap-5 mt-3 text-xs text-white/50">
            <span>Personal</span>
            <span>Account</span>
            <span>Institution</span>
            <span>Review</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
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
            <div className="flex gap-2">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded-full transition-colors ${step >= i + 1 ? 'bg-primary-600' : 'bg-dark-200'
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
                <h1 className="text-3xl font-bold font-heading text-dark-900 mb-2">Personal Info</h1>
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
                  <Button type="submit" variant="primary" size="lg" className="w-full" icon={ArrowRight} iconPosition="right">
                    Continue
                  </Button>
                </form>
              </motion.div>
            )}

            {/* ── Step 2: Password + Role ── */}
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
                <h1 className="text-3xl font-bold font-heading text-dark-900 mb-2">Account Setup</h1>
                <p className="text-dark-500 mb-8">Set your password and select your role</p>

                <form onSubmit={stepTwoForm.handleSubmit(handleStepTwo)} className="space-y-5">
                  <Input
                    label="Password"
                    type="password"
                    icon={Lock}
                    placeholder="Min 8 characters"
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

                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-3">
                      Select Your Role
                    </label>
                    {stepTwoForm.formState.errors.role?.message && (
                      <p className="text-sm text-red-500 mb-2">{stepTwoForm.formState.errors.role.message}</p>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      {roleOptions.map((r) => {
                        const isSelected = stepTwoForm.watch('role') === r.value
                        return (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => stepTwoForm.setValue('role', r.value, { shouldValidate: true })}
                            className={`relative p-4 rounded-xl border-2 transition-all text-left ${isSelected
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-dark-200 hover:border-dark-300 bg-white'
                              }`}
                          >
                            {isSelected && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle className="w-5 h-5 text-primary-600" />
                              </div>
                            )}
                            <r.icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-primary-600' : 'text-dark-400'}`} />
                            <p className={`text-sm font-semibold ${isSelected ? 'text-primary-700' : 'text-dark-700'}`}>
                              {r.label}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="secondary" size="lg" onClick={() => setStep(1)} icon={ArrowLeft} className="flex-1">
                      Back
                    </Button>
                    <Button type="submit" variant="primary" size="lg" icon={ArrowRight} iconPosition="right" className="flex-1">
                      Continue
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ── Step 3: Institution Selection ── */}
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
                <h1 className="text-3xl font-bold font-heading text-dark-900 mb-2">Your Institution</h1>
                <p className="text-dark-500 mb-8">
                  {needsDepartment
                    ? 'Select your college and department'
                    : 'Select your college'}
                </p>

                <div className="space-y-5">
                  {/* College Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">
                      College <span className="text-red-500">*</span>
                    </label>
                    {collegesLoading ? (
                      <div className="input-field flex items-center gap-2 text-dark-400">
                        <svg className="animate-spin w-4 h-4 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Loading colleges...
                      </div>
                    ) : (
                      <div className="relative">
                        <select
                          value={selectedCollegeId}
                          onChange={(e) => {
                            setSelectedCollegeId(e.target.value)
                            setCollegeError('')
                            setDepartmentError('')
                          }}
                          className="input-field w-full appearance-none pr-10"
                        >
                          <option value="">Select a college...</option>
                          {colleges.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} — {c.city}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" />
                      </div>
                    )}
                    {collegeError && <p className="text-sm text-red-500 mt-1">{collegeError}</p>}
                  </div>

                  {/* Department Dropdown — only for HOD, Professor, Student */}
                  {needsDepartment && (
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1">
                        Department <span className="text-red-500">*</span>
                      </label>
                      {!selectedCollegeId ? (
                        <div className="input-field text-dark-400 text-sm">
                          Please select a college first
                        </div>
                      ) : departmentsLoading ? (
                        <div className="input-field flex items-center gap-2 text-dark-400">
                          <svg className="animate-spin w-4 h-4 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Loading departments...
                        </div>
                      ) : (
                        <div className="relative">
                          <select
                            value={selectedDepartmentId}
                            onChange={(e) => {
                              setSelectedDepartmentId(e.target.value)
                              setDepartmentError('')
                            }}
                            className="input-field w-full appearance-none pr-10"
                          >
                            <option value="">Select a department...</option>
                            {departments.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.name} ({d.code})
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" />
                        </div>
                      )}
                      {departmentError && <p className="text-sm text-red-500 mt-1">{departmentError}</p>}
                      {selectedCollegeId && !departmentsLoading && departments.length === 0 && (
                        <p className="text-sm text-amber-600 mt-1">
                          No departments found for this college yet.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button type="button" variant="secondary" size="lg" onClick={() => setStep(2)} icon={ArrowLeft} className="flex-1">
                      Back
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      icon={ArrowRight}
                      iconPosition="right"
                      className="flex-1"
                      onClick={handleStepThree}
                      disabled={collegesLoading}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 4: Review & Submit ── */}
            {step === 4 && (
              <motion.div
                key="step4"
                custom={4}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold font-heading text-dark-900 mb-2">Review & Submit</h1>
                <p className="text-dark-500 mb-8">Please confirm your details</p>

                <div className="bg-white rounded-2xl p-6 border border-dark-100 space-y-3 mb-8">
                  {[
                    { label: 'Name', value: formData.name },
                    { label: 'Email', value: formData.email },
                    formData.phone ? { label: 'Phone', value: formData.phone } : null,
                    { label: 'Role', value: ROLE_LABELS[formData.role], highlight: true },
                    { label: 'College', value: formData.collegeName },
                    needsDepartment && formData.departmentName
                      ? { label: 'Department', value: formData.departmentName }
                      : null,
                  ]
                    .filter(Boolean)
                    .map((item, idx, arr) => (
                      <div
                        key={item.label}
                        className={`flex items-center justify-between py-2 ${idx < arr.length - 1 ? 'border-b border-dark-50' : ''
                          }`}
                      >
                        <span className="text-sm text-dark-500">{item.label}</span>
                        <span
                          className={`text-sm font-medium ${item.highlight ? 'text-primary-600' : 'text-dark-900'
                            }`}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" size="lg" onClick={() => setStep(3)} icon={ArrowLeft} className="flex-1">
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