import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Calendar, Award, Clock, FileText, ClipboardList, BarChart3, Megaphone, ArrowRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import studentAPI from '../../api/student.api'
import useAuthStore from '../../store/authStore'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { SkeletonStatCards } from '../../components/ui/Skeleton'
import { formatDate } from '../../utils/formatters'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const { data: events = [] } = useQuery({
    queryKey: ['student-events'],
    queryFn: () => studentAPI.getEvents().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const { data: clubs = [] } = useQuery({
    queryKey: ['student-clubs'],
    queryFn: () => studentAPI.getMyClubs().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const { data: broadcasts = [], isLoading } = useQuery({
    queryKey: ['student-broadcasts'],
    queryFn: () => studentAPI.getBroadcasts().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const quickLinks = [
    { label: 'Events', icon: Calendar, path: '/student/events', color: 'bg-orange-500' },
    { label: 'My Clubs', icon: Award, path: '/student/clubs', color: 'bg-amber-500' },
    { label: 'Timetable', icon: Clock, path: '/student/timetable', color: 'bg-blue-500' },
    { label: 'Notes', icon: FileText, path: '/student/notes', color: 'bg-emerald-500' },
    { label: 'Submissions', icon: ClipboardList, path: '/student/submissions', color: 'bg-purple-500' },
    { label: 'Progress', icon: BarChart3, path: '/student/progress', color: 'bg-teal-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 mesh-gradient opacity-20" />
        <div className="relative">
          <h1 className="text-2xl font-bold font-heading mb-1">Hey, {user?.name}! 🎓</h1>
          <p className="text-white/70">Let&apos;s make today productive.</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Calendar} label="Available Events" value={events.length} color="orange" delay={0} />
        <StatCard icon={Award} label="My Clubs" value={clubs.length} color="yellow" delay={0.1} />
        <StatCard icon={Megaphone} label="Broadcasts" value={broadcasts.length} color="blue" delay={0.2} />
        <StatCard icon={BarChart3} label="Progress" value="—" color="green" delay={0.3} />
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold font-heading text-dark-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickLinks.map((link, idx) => (
            <motion.button
              key={link.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(link.path)}
              className="bg-white rounded-2xl p-5 border border-dark-100 hover:border-primary-200 hover:shadow-card-hover transition-all duration-300 text-center group"
            >
              <div className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <link.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-dark-700 group-hover:text-primary-600 transition-colors">{link.label}</p>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold font-heading text-dark-900">Upcoming Events</h3>
            <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right" onClick={() => navigate('/student/events')}>View All</Button>
          </div>
          {events.length === 0 ? (
            <p className="text-sm text-dark-400 py-4 text-center">No upcoming events</p>
          ) : (
            <div className="space-y-3">
              {events.slice(0, 4).map((event, idx) => (
                <motion.div key={event.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-dark-50/50 hover:bg-dark-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center"><Calendar className="w-4 h-4 text-orange-600" /></div>
                    <div>
                      <p className="text-sm font-medium text-dark-900">{event.title}</p>
                      <p className="text-xs text-dark-400">{formatDate(event.eventDate)}</p>
                    </div>
                  </div>
                  <Badge color="blue" size="sm">{event.eventLevel}</Badge>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Broadcasts */}
        <Card hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold font-heading text-dark-900">Recent Broadcasts</h3>
            <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right" onClick={() => navigate('/student/broadcasts')}>View All</Button>
          </div>
          {broadcasts.length === 0 ? (
            <p className="text-sm text-dark-400 py-4 text-center">No broadcasts yet</p>
          ) : (
            <div className="space-y-3">
              {broadcasts.slice(0, 4).map((b, idx) => (
                <motion.div key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                  className="p-3 rounded-xl bg-dark-50/50 hover:bg-dark-50 transition-colors">
                  <p className="text-sm font-medium text-dark-900">{b.title}</p>
                  <p className="text-xs text-dark-400 line-clamp-1 mt-0.5">{b.message}</p>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
