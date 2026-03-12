import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Users, Award, Calendar, Clock, ArrowRight, Megaphone,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import hodAPI from '../../api/hod.api'
import useAuthStore from '../../store/authStore'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { SkeletonStatCards } from '../../components/ui/Skeleton'
import { CLUB_STATUS_COLORS } from '../../utils/constants'
import { formatEnumLabel, formatTime } from '../../utils/formatters'

export default function HODDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const { data: clubRequests = [] } = useQuery({
    queryKey: ['hod-club-requests'],
    queryFn: () => hodAPI.getClubRequests().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const { data: events = [] } = useQuery({
    queryKey: ['hod-events'],
    queryFn: () => hodAPI.getEvents().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const { data: timetable = [], isLoading } = useQuery({
    queryKey: ['hod-timetable'],
    queryFn: () => hodAPI.getTimetable().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const pendingClubs = clubRequests.filter((c) => c.status === 'PENDING_HOD')
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const today = days[new Date().getDay() - 1] || 'Monday'
  const todaySchedule = timetable
    .filter((t) => t.dayOfWeek === today)
    .sort((a, b) => (a.fromTime || '').localeCompare(b.fromTime || ''))

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 mesh-gradient opacity-20" />
        <div className="relative">
          <h1 className="text-2xl font-bold font-heading mb-1">
            Hello, {user?.name}! 👋
          </h1>
          <p className="text-white/70">Manage your department from here.</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Clock} label="Timetable Entries" value={timetable.length} color="blue" delay={0} />
        <StatCard icon={Award} label="Pending Clubs" value={pendingClubs.length} color="yellow" delay={0.1} />
        <StatCard icon={Calendar} label="Events" value={events.length} color="orange" delay={0.2} />
        <StatCard icon={Users} label="Club Requests" value={clubRequests.length} color="purple" delay={0.3} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold font-heading text-dark-900">
              Today&apos;s Schedule ({today})
            </h3>
            <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right" onClick={() => navigate('/hod/timetable')}>
              Full Timetable
            </Button>
          </div>
          {todaySchedule.length === 0 ? (
            <p className="text-sm text-dark-400 py-4 text-center">No classes scheduled today</p>
          ) : (
            <div className="space-y-3">
              {todaySchedule.map((slot, idx) => (
                <motion.div
                  key={slot.id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-dark-50/50"
                >
                  <div className="text-xs font-mono text-dark-500 w-24 text-center">
                    {formatTime(slot.fromTime)} – {formatTime(slot.toTime)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-dark-900">{slot.subject}</p>
                    <p className="text-xs text-dark-400">{slot.teacherName} • {slot.room}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Pending Club Requests */}
        <Card hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold font-heading text-dark-900">Pending Club Requests</h3>
            <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right" onClick={() => navigate('/hod/club-requests')}>
              View All
            </Button>
          </div>
          {pendingClubs.length === 0 ? (
            <p className="text-sm text-dark-400 py-4 text-center">No pending requests</p>
          ) : (
            <div className="space-y-3">
              {pendingClubs.slice(0, 5).map((club, idx) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-dark-50/50"
                >
                  <div>
                    <p className="text-sm font-medium text-dark-900">{club.name}</p>
                    <p className="text-xs text-dark-400">by {club.createdByName || 'Student'}</p>
                  </div>
                  <Badge color={CLUB_STATUS_COLORS[club.status]} size="sm">
                    {formatEnumLabel(club.status)}
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
