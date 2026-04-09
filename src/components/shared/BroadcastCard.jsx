import { motion } from 'framer-motion'
import { Megaphone, Clock, User } from 'lucide-react'
import Badge from '../ui/Badge'
import { formatRelativeTime } from '../../utils/formatters'
import { BROADCAST_LEVEL_COLORS } from '../../utils/constants'

const levelBorderColors = {
  CAMPUS: 'border-l-purple-500',
  COLLEGE: 'border-l-blue-500',
  DEPARTMENT: 'border-l-teal-500',
}

export default function BroadcastCard({ broadcast, delay = 0 }) {
  const { title, message, level, senderName, senderRole, sentAt, attachmentUrl } = broadcast
  const broadcastLevel = level

  const displaySenderName = senderName || 'Campus'
  const displaySenderRole = senderRole || (displaySenderName === 'Campus' ? 'Admin' : 'Unknown')

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 border-l-4 ${
        levelBorderColors[broadcastLevel] || 'border-l-blue-500'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold font-heading text-dark-900">{title}</h3>
            <div className="flex items-center gap-2 text-xs mt-0.5">
              <div className="flex items-center gap-1.5 text-dark-500">
                <User className="w-3.5 h-3.5 text-dark-400" />
                <span className="font-bold text-dark-900">{displaySenderName}</span>
                <span className="text-dark-300">•</span>
                <span className="text-dark-500 font-medium">{displaySenderRole}</span>
              </div>
              <span className="text-dark-300 mx-0.5">•</span>
              <div className="flex items-center gap-1.5 text-dark-400 font-medium">
                <Clock className="w-3.5 h-3.5 text-dark-400" />
                <span>{formatRelativeTime(sentAt)}</span>
              </div>
            </div>
          </div>
        </div>
        <Badge color={BROADCAST_LEVEL_COLORS[broadcastLevel]} size="sm">
          {broadcastLevel}
        </Badge>
      </div>
      <p className="text-sm text-dark-600 leading-relaxed">{message}</p>
      {attachmentUrl && (
        <a
          href={attachmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mt-3 font-medium"
        >
          📎 View Attachment
        </a>
      )}
    </motion.div>
  )
}
