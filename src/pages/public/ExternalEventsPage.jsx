import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import {
  Calendar, MapPin, Clock, Search, GraduationCap, ArrowRight,
  Sparkles, CheckCircle, Mail, AlertCircle, ShieldAlert, CreditCard
} from 'lucide-react'
import toast from 'react-hot-toast'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

import { externalAPI } from '../../api/external.api'
import { formatDate, formatTime, formatCurrency } from '../../utils/formatters'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder')

const guestSchema = z.object({
  guestName: z.string().min(2, 'Name must be at least 2 characters'),
  guestEmail: z.string().email('Please enter a valid email address'),
  collegeName: z.string().min(2, 'College name must be at least 2 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
})

// Sub-component for Payment
function PaymentStep({ clientSecret, guestName, guestEmail, onPaymentSuccess, onCancel }) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)

  const handlePayment = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    const cardElement = elements.getElement(CardElement)

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: guestName,
            email: guestEmail,
          },
        },
      })

      if (error) {
        toast.error(error.message || 'Payment failed')
      } else if (paymentIntent.status === 'succeeded') {
        toast.success('Registered successfully! Check your email for confirmation.')
        onPaymentSuccess()
      }
    } catch (err) {
      toast.error('Payment error occurred')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <div className="p-4 bg-primary-50 rounded-xl border border-primary-100 text-sm text-primary-800 flex gap-2">
        <CreditCard className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Complete Payment</p>
          <p className="text-xs mt-0.5">Enter test/real card credentials to complete registration.</p>
        </div>
      </div>

      <div className="border border-dark-200 rounded-xl p-4 bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#0f172a',
                '::placeholder': {
                  color: '#94a3b8',
                },
              },
            },
          }}
        />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={processing}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={processing} disabled={!stripe}>
          Pay Now
        </Button>
      </div>
    </form>
  )
}

export default function ExternalEventsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [clientSecret, setClientSecret] = useState(null)
  const [guestData, setGuestData] = useState(null)
  const [lookupEmail, setLookupEmail] = useState('')
  const [lookupTriggered, setLookupTriggered] = useState(false)

  // Fetch events
  const { data: events = [], isLoading, refetch } = useQuery({
    queryKey: ['external-events'],
    queryFn: () => externalAPI.getEvents().then((r) => Array.isArray(r.data?.data) ? r.data.data : Array.isArray(r.data) ? r.data : []),
  })

  // Fetch registrations
  const { data: registrations = [], isLoading: lookupLoading, refetch: fetchRegistrations } = useQuery({
    queryKey: ['my-external-registrations', lookupEmail],
    queryFn: () => externalAPI.getMyRegistrations(lookupEmail).then((r) => Array.isArray(r.data?.data) ? r.data.data : Array.isArray(r.data) ? r.data : []),
    enabled: false,
  })

  const registerForm = useForm({
    resolver: zodResolver(guestSchema),
    defaultValues: { guestName: '', guestEmail: '', collegeName: '', city: '' }
  })

  const onRegisterSubmit = async (data) => {
    try {
      const res = await externalAPI.registerGuest(selectedEvent.id, data)
      const returnedSecret = res.data?.stripeClientSecret || res.data?.data?.stripeClientSecret

      if (returnedSecret) {
        setGuestData(data)
        setClientSecret(returnedSecret)
      } else {
        toast.success('Registered successfully! Check your email for confirmation.')
        setSelectedEvent(null)
        registerForm.reset()
        refetch()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
  }

  const handleLookup = (e) => {
    e.preventDefault()
    if (!lookupEmail) {
      toast.error('Please enter your email')
      return
    }
    setLookupTriggered(true)
    fetchRegistrations()
  }

  // Client-side filter
  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* ─── MINIMAL NAVBAR ─── */}
      <nav className="bg-white border-b border-dark-100 py-4 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold font-heading text-dark-900">
              Campus<span className="text-accent-400">Nexus</span>
            </span>
          </Link>
          <Link
            to="/login"
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-xl transition-all"
          >
            Staff Login
          </Link>
        </div>
      </nav>

      {/* ─── HERO BANNER ─── */}
      <header className="relative gradient-bg overflow-hidden py-20 px-6 sm:px-8">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-accent-400" />
            <span className="text-xs text-white/90 font-medium">Public Event Access</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold font-heading text-white"
          >
            Open Campus Events
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/70 max-w-2xl mx-auto"
          >
            Browse and register for events open to external participants. Join guest lectures, hackathons, and cultural activities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto flex items-center bg-white rounded-2xl shadow-lg border border-dark-200 px-4 py-2"
          >
            <Search className="w-5 h-5 text-dark-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search open events by title or description..."
              className="bg-transparent text-dark-900 placeholder-dark-400 outline-none flex-1 text-sm py-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
        </div>
      </header>

      {/* ─── EVENTS GRID ─── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-8 py-12 space-y-16">
        <section>
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title={searchTerm ? "No matching events found" : "No open events scheduled"}
              description={searchTerm ? "Try broadening your search keywords." : "Check back later for open public campus events."}
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, idx) => {
                const isFree = !event.ticketPrice || event.ticketPrice === 0
                const isFull = event.maxParticipants > 0 && (event.registeredCount || 0) >= event.maxParticipants
                const eventLevelColors = {
                  CAMPUS: 'from-purple-500 to-indigo-600',
                  COLLEGE: 'from-blue-500 to-cyan-600',
                  DEPARTMENT: 'from-teal-500 to-emerald-600',
                  CLUB: 'from-orange-500 to-red-500',
                }

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group flex flex-col justify-between"
                  >
                    <div>
                      {/* Image / Gradient */}
                      <div className={`h-40 bg-gradient-to-r ${eventLevelColors[event.eventLevel] || eventLevelColors.CAMPUS} relative overflow-hidden`}>
                        {event.posterUrl ? (
                          <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="w-12 h-12 text-white/30" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge color="blue" size="sm">Open to External</Badge>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <span className="px-3 py-1 bg-white/95 backdrop-blur rounded-full text-sm font-bold text-dark-900 shadow-sm">
                            {isFree ? '🎉 FREE' : formatCurrency(event.ticketPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <h3 className="text-lg font-bold font-heading text-dark-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                          {event.title}
                        </h3>
                        {event.description && (
                          <p className="text-sm text-dark-500 line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>
                        )}

                        <div className="space-y-2 text-sm text-dark-500 pt-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary-500 flex-shrink-0" />
                            <span>{formatDate(event.startDateTime)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary-500 flex-shrink-0" />
                            <span>{formatTime(event.startDateTime)} — {formatTime(event.endDateTime)}</span>
                          </div>
                          {event.venue && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
                              <span className="line-clamp-1">{event.venue}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        disabled={isFull}
                        className={`w-full py-2.5 rounded-xl font-semibold text-white transition-all shadow-sm ${isFull
                            ? 'bg-dark-300 cursor-not-allowed'
                            : 'bg-primary-600 hover:bg-primary-700 hover:shadow-md'
                          }`}
                      >
                        {isFull ? 'Sold Out' : 'Register Now'}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </section>

        {/* ─── CHECK REGISTRATIONS PANEL ─── */}
        <section className="bg-white rounded-2xl border border-dark-200 p-6 sm:p-8 max-w-3xl mx-auto shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-dark-900">Check My Registrations</h2>
              <p className="text-dark-500 text-sm mt-1">Look up ticket details, confirmation status, and receipt history by email.</p>
            </div>
          </div>

          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter registered email address..."
              required
              className="input-field flex-1 text-sm py-2 px-4"
              value={lookupEmail}
              onChange={(e) => setLookupEmail(e.target.value)}
            />
            <Button variant="primary" type="submit" loading={lookupLoading} icon={ArrowRight} iconPosition="right">
              Look up
            </Button>
          </form>

          {/* Results Table */}
          {lookupTriggered && (
            <div className="mt-8 border-t border-dark-100 pt-6">
              {lookupLoading ? (
                <p className="text-dark-400 text-sm text-center py-4">Checking database registrations...</p>
              ) : registrations.length === 0 ? (
                <div className="text-center py-6 text-dark-500 flex flex-col items-center gap-2">
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                  <p className="font-medium">No registrations found</p>
                  <p className="text-xs max-w-sm">No ticket records exist for this email. Check spelling or register for an event above.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-dark-100">
                  <table className="w-full text-sm text-left align-middle whitespace-nowrap">
                    <thead className="bg-dark-50 text-dark-500 font-semibold border-b border-dark-100">
                      <tr>
                        <th className="px-4 py-3">Event Title</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Ticket Status</th>
                        <th className="px-4 py-3">Payment Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-100 text-dark-700">
                      {registrations.map((reg) => (
                        <tr key={reg.id || reg.registrationId} className="hover:bg-dark-50/50">
                          <td className="px-4 py-3 font-semibold text-dark-900">{reg.eventTitle || reg.title || 'N/A'}</td>
                          <td className="px-4 py-3 text-dark-500">{reg.eventDate ? formatDate(reg.eventDate) : 'N/A'}</td>
                          <td className="px-4 py-3">
                            <Badge color={reg.ticketStatus === 'CONFIRMED' || reg.ticketStatus === 'VALID' ? 'green' : 'gray'}>
                              {reg.ticketStatus || 'N/A'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge color={reg.paymentStatus === 'PAID' || reg.paymentStatus === 'COMPLETED' ? 'green' : 'amber'}>
                              {reg.paymentStatus || 'N/A'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* ─── REGISTER MODAL ─── */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => {
          if (!clientSecret) {
            setSelectedEvent(null)
            registerForm.reset()
          }
        }}
        title={`Register for ${selectedEvent?.title}`}
        size="md"
      >
        {clientSecret ? (
          <Elements stripe={stripePromise}>
            <PaymentStep
              clientSecret={clientSecret}
              guestName={guestData?.guestName}
              guestEmail={guestData?.guestEmail}
              onPaymentSuccess={() => {
                setSelectedEvent(null)
                setClientSecret(null)
                setGuestData(null)
                registerForm.reset()
                refetch()
              }}
              onCancel={() => {
                setClientSecret(null)
                setGuestData(null)
              }}
            />
          </Elements>
        ) : (
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. John Doe"
              error={registerForm.formState.errors.guestName?.message}
              {...registerForm.register('guestName')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. john@example.com"
              error={registerForm.formState.errors.guestEmail?.message}
              {...registerForm.register('guestEmail')}
            />

            <Input
              label="College Name"
              placeholder="e.g. MIT College of Engineering"
              error={registerForm.formState.errors.collegeName?.message}
              {...registerForm.register('collegeName')}
            />

            <Input
              label="City"
              placeholder="e.g. Pune"
              error={registerForm.formState.errors.city?.message}
              {...registerForm.register('city')}
            />

            <div className="flex gap-3 justify-end pt-2">
              <Button variant="secondary" type="button" onClick={() => setSelectedEvent(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={registerForm.formState.isSubmitting}>
                Confirm Registration
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
