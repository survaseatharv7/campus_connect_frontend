import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Users, Clock, Tag, CheckCircle, Trash2, AlertTriangle } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { formatDate, formatTime, formatCurrency, formatEnumLabel } from '../../utils/formatters'
import { EVENT_STATUS_COLORS, EVENT_LEVEL_COLORS } from '../../utils/constants'

/**
 * Determines if a ticket price should be displayed as FREE.
 * Only ticketPrice === 0 (or null/undefined) is FREE.
 * Backend guarantees no negative values, but we guard anyway.
 */
function isFreeEvent(ticketPrice) {
  if (ticketPrice === null || ticketPrice === undefined) return true
  const price = Number(ticketPrice)
  return price <= 0
}

/**
 * Returns true if the Register button should be disabled.
 */
function isRegisterDisabled(event, isRegistered, isRegistering) {
  if (isRegistered) return true
  if (isRegistering) return true
  const status = event?.status
  if (status === 'COMPLETED' || status === 'CANCELLED') return true
  const isFull = event.maxParticipants > 0 && (event.registeredCount || 0) >= event.maxParticipants
  if (isFull) return true
  return false
}

/**
 * Returns the label for the Register button based on current state.
 */
function getRegisterLabel(event, isRegistered, isRegistering) {
  if (isRegistering) return 'Registering...'
  if (isRegistered) return '✓ Registered'
  const status = event?.status
  if (status === 'COMPLETED') return 'Event Ended'
  if (status === 'CANCELLED') return 'Cancelled'
  const isFull = event.maxParticipants > 0 && (event.registeredCount || 0) >= event.maxParticipants
  if (isFull) return 'Full'
  return 'Register'
}

export default function EventCard({
  event,
  onRegister,
  onView,
  onApprove,
  onDelete,
  showRegister = false,
  showApprove = false,
  isRegistered = false,
  isRegistering = false,
  isOwner = false,
  delay = 0,
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const {
    title,
    description,
    startDateTime,
    endDateTime,
    venue,
    eventLevel,
    status,
    ticketPrice,
    maxParticipants,
    registeredCount,
    posterUrl,
  } = event

  // Parse startDateTime/endDateTime for display
  const eventDate = startDateTime
  const startTime = startDateTime ? new Date(startDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : null
  const endTime = endDateTime ? new Date(endDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : null

  // Price display — backend guarantees 0 = FREE, no negatives
  const free = isFreeEvent(ticketPrice)
  const participantPercentage =
    maxParticipants > 0 ? Math.min(((registeredCount || 0) / maxParticipants) * 100, 100) : 0

  const registerDisabled = isRegisterDisabled(event, isRegistered, isRegistering)
  const registerLabel = getRegisterLabel(event, isRegistered, isRegistering)

  const gradientColors = {
    CAMPUS: 'from-purple-500 to-indigo-600',
    COLLEGE: 'from-blue-500 to-cyan-600',
    DEPARTMENT: 'from-teal-500 to-emerald-600',
    CLUB: 'from-orange-500 to-red-500',
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group"
      >
        {/* Thumbnail */}
        <div
          className={`h-40 bg-gradient-to-r ${gradientColors[eventLevel] || gradientColors.CAMPUS} relative overflow-hidden`}
        >
          {posterUrl ? (
            <img src={posterUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-white/30" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge color={EVENT_LEVEL_COLORS[eventLevel]} size="sm">
              {eventLevel}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            {/* Status badge — displayed exactly as received from backend */}
            <Badge color={EVENT_STATUS_COLORS[status] || 'gray'} variant="solid" size="sm">
              {status ? formatEnumLabel(status) : 'N/A'}
            </Badge>
          </div>
          <div className="absolute bottom-3 right-3">
            {/* Price display — 0 = FREE (no negative values from backend) */}
            <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-sm font-semibold text-dark-900">
              {free ? '🎉 FREE' : formatCurrency(Number(ticketPrice))}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold font-heading text-dark-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-dark-500 mb-3 line-clamp-2">{description}</p>
          )}

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-dark-500">
              <Calendar className="w-4 h-4 text-primary-500" />
              <span>{formatDate(eventDate)}</span>
            </div>
            {startTime && (
              <div className="flex items-center gap-2 text-sm text-dark-500">
                <Clock className="w-4 h-4 text-primary-500" />
                <span>
                  {formatTime(startTime)} — {formatTime(endTime)}
                </span>
              </div>
            )}
            {venue && (
              <div className="flex items-center gap-2 text-sm text-dark-500">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span className="line-clamp-1">{venue}</span>
              </div>
            )}
          </div>

          {/* Participants Bar */}
          {maxParticipants > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-dark-500 mb-1">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {registeredCount || 0} registered
                </span>
                <span>{maxParticipants} max</span>
              </div>
              <div className="w-full h-2 bg-dark-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${participantPercentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full rounded-full ${participantPercentage > 80 ? 'bg-red-500' : 'bg-primary-500'
                    }`}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            {onView && (
              <Button variant="secondary" size="sm" onClick={() => onView(event)} className="flex-1 min-w-0">
                View Details
              </Button>
            )}
            {showApprove && status === 'PENDING' && onApprove && (
              <Button
                variant="success"
                size="sm"
                icon={CheckCircle}
                onClick={() => onApprove(event)}
                className="flex-1 min-w-0"
              >
                Approve
              </Button>
            )}
            {showRegister && (
              <button
                onClick={() => !registerDisabled && onRegister(event)}
                disabled={registerDisabled}
                title={
                  event.status === 'COMPLETED' ? 'This event has ended'
                  : event.status === 'CANCELLED' ? 'This event was cancelled'
                  : isRegistered ? 'Already registered'
                  : (event.maxParticipants > 0 && (event.registeredCount || 0) >= event.maxParticipants) ? 'Event is full'
                  : undefined
                }
                className={`px-4 py-2 rounded-lg flex-1 font-semibold text-sm transition-all duration-200 ${
                  registerDisabled
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
                    : 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow'
                }`}
              >
                {registerLabel}
              </button>
            )}
            {/* Delete button — only for event owner */}
            {isOwner && onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 border border-red-100 hover:border-red-300"
                title="Delete event"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark-900">Delete Event</h3>
                  <p className="text-xs text-dark-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-sm text-dark-600 mb-5">
                Are you sure you want to delete <span className="font-semibold text-dark-900">{title}</span>?
                All registrations and sub-events will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-dark-200 text-dark-700 hover:bg-dark-50 font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    onDelete(event)
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors"
                >
                  Delete Event
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
