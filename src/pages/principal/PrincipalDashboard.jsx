import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  School, Users, Award, Calendar, ArrowRight, Clock,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import principalAPI from '../../api/principal.api'
import useAuthStore from '../../store/authStore'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { SkeletonStatCards } from '../../components/ui/Skeleton'
import { CLUB_STATUS_COLORS } from '../../utils/constants'
import { formatEnumLabel, formatRelativeTime } from '../../utils/formatters'

export default function PrincipalDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const { data: departments = [], isLoading: deptLoading } = useQuery({
    queryKey: ['principal-departments'],
    queryFn: () => principalAPI.getDepartments().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const { data: professors = [] } = useQuery({
    queryKey: ['principal-professors'],
    queryFn: () => principalAPI.getProfessors().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const { data: clubRequests = [] } = useQuery({
    queryKey: ['principal-club-requests'],
    queryFn: () => principalAPI.getClubRequests().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const { data: events = [] } = useQuery({
    queryKey: ['principal-events'],
    queryFn: () => principalAPI.getEvents().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const pendingClubs = clubRequests.filter((c) => c.status === 'PENDING_PRINCIPAL')

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 mesh-gradient opacity-20" />
        <div className="relative">
          <h1 className="text-2xl font-bold font-heading mb-1">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name}! 👋
          </h1>
          <p className="text-white/70">Here&apos;s what&apos;s happening at your college today.</p>
        </div>
      </motion.div>

      {/* Stats */}
      {deptLoading ? (
        <SkeletonStatCards count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={School} label="Departments" value={departments.length} color="blue" delay={0} />
          <StatCard icon={Users} label="Professors" value={professors.length} color="purple" delay={0.1} />
          <StatCard icon={Award} label="Pending Clubs" value={pendingClubs.length} color="yellow" delay={0.2} />
          <StatCard icon={Calendar} label="Events" value={events.length} color="orange" delay={0.3} />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Club Requests */}
        <Card hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold font-heading text-dark-900">Pending Club Requests</h3>
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/principal/club-requests')}
            >
              View All
            </Button>
          </div>
          {pendingClubs.length === 0 ? (
            <p className="text-sm text-dark-400 py-4 text-center">No pending requests</p>
          ) : (
            <div className="space-y-3">
              {pendingClubs.slice(0, 3).map((club, idx) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-dark-50/50 hover:bg-dark-50 transition-colors"
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

        {/* Upcoming Events */}
        <Card hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold font-heading text-dark-900">Upcoming Events</h3>
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/principal/events')}
            >
              View All
            </Button>
          </div>
          {events.length === 0 ? (
            <p className="text-sm text-dark-400 py-4 text-center">No upcoming events</p>
          ) : (
            <div className="space-y-3">
              {events.slice(0, 5).map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-dark-50/50 hover:bg-dark-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-900">{event.title}</p>
                      <p className="text-xs text-dark-400">{event.venue}</p>
                    </div>
                  </div>
                  <Badge color="blue" size="sm">
                    {formatEnumLabel(event.eventStatus || 'UPCOMING')}
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
