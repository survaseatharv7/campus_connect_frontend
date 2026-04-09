import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Clock, Tag, CheckCircle } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { formatDate, formatTime, formatCurrency, formatEnumLabel } from '../../utils/formatters'
import { EVENT_STATUS_COLORS, EVENT_LEVEL_COLORS } from '../../utils/constants'

export default function EventCard({
  event,
  onRegister,
  onView,
  onApprove,
  showRegister = false,
  showApprove = false,
  isRegistered = false,
  isRegistering = false,
  delay = 0,
}) {
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

  const isFree = !ticketPrice || ticketPrice === 0
  const participantPercentage =
    maxParticipants > 0 ? Math.min(((registeredCount || 0) / maxParticipants) * 100, 100) : 0
  const isFull = maxParticipants > 0 && registeredCount >= maxParticipants

  const gradientColors = {
    CAMPUS: 'from-purple-500 to-indigo-600',
    COLLEGE: 'from-blue-500 to-cyan-600',
    DEPARTMENT: 'from-teal-500 to-emerald-600',
    CLUB: 'from-orange-500 to-red-500',
  }

  return (
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
          <Badge color={EVENT_STATUS_COLORS[status]} variant="solid" size="sm">
            {status ? formatEnumLabel(status) : 'N/A'}
          </Badge>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-sm font-semibold text-dark-900">
            {isFree ? '🎉 FREE' : formatCurrency(ticketPrice)}
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
                className={`h-full rounded-full ${
                  participantPercentage > 80 ? 'bg-red-500' : 'bg-primary-500'
                }`}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {onView && (
            <Button variant="secondary" size="sm" onClick={() => onView(event)} className="flex-1">
              View Details
            </Button>
          )}
          {showApprove && status === 'PENDING' && onApprove && (
            <Button
              variant="success"
              size="sm"
              icon={CheckCircle}
              onClick={() => onApprove(event)}
              className="flex-1"
            >
              Approve
            </Button>
          )}
          {showRegister && (
            <button
              onClick={() => onRegister(event)}
              disabled={isRegistered || isFull || isRegistering}
              className={`px-4 py-2 rounded flex-1 font-semibold text-white transition-all ${
                isRegistered || isFull
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isRegistering ? 'Registering...' : isRegistered ? "Registered" : isFull ? "Full" : "Register"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
