import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  BookOpen, ClipboardList, FileText, Clock, Calendar, BarChart3, ArrowRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import professorAPI from '../../api/professor.api'
import useAuthStore from '../../store/authStore'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { SkeletonStatCards } from '../../components/ui/Skeleton'

export default function ProfessorDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const { data: batches = [], isLoading } = useQuery({
    queryKey: ['prof-batches'],
    queryFn: () => professorAPI.getBatches().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const { data: notes = [] } = useQuery({
    queryKey: ['prof-notes'],
    queryFn: () => professorAPI.getNotes().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const quickLinks = [
    { label: 'Manage Batches', icon: BookOpen, path: '/professor/batches', color: 'bg-blue-500' },
    { label: 'View Submissions', icon: ClipboardList, path: '/professor/submissions', color: 'bg-purple-500' },
    { label: 'Upload Notes', icon: FileText, path: '/professor/notes', color: 'bg-emerald-500' },
    { label: 'My Availability', icon: Clock, path: '/professor/availability', color: 'bg-orange-500' },
    { label: 'Create Event', icon: Calendar, path: '/professor/events', color: 'bg-pink-500' },
    { label: 'Student Progress', icon: BarChart3, path: '/professor/progress', color: 'bg-teal-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 mesh-gradient opacity-20" />
        <div className="relative">
          <h1 className="text-2xl font-bold font-heading mb-1">Welcome, Prof. {user?.name}! 📚</h1>
          <p className="text-white/70">Here&apos;s your teaching overview.</p>
        </div>
      </motion.div>

      {/* Stats */}
      {isLoading ? (
        <SkeletonStatCards count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={BookOpen} label="Batches" value={batches.length} color="blue" delay={0} />
          <StatCard icon={FileText} label="Notes Uploaded" value={notes.length} color="green" delay={0.1} />
          <StatCard icon={ClipboardList} label="Pending Reviews" value={0} color="yellow" delay={0.2} />
          <StatCard icon={BarChart3} label="Students" value={0} color="purple" delay={0.3} />
        </div>
      )}

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold font-heading text-dark-900 mb-4">Quick Actions</h2>
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

      {/* Recent Batches */}
      <Card hover={false}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold font-heading text-dark-900">My Batches</h3>
          <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right" onClick={() => navigate('/professor/batches')}>View All</Button>
        </div>
        {batches.length === 0 ? (
          <p className="text-sm text-dark-400 py-4 text-center">No batches yet. Create your first batch.</p>
        ) : (
          <div className="space-y-3">
            {batches.slice(0, 5).map((batch, idx) => (
              <motion.div key={batch.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between p-3 rounded-xl bg-dark-50/50 hover:bg-dark-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center"><BookOpen className="w-4 h-4 text-blue-600" /></div>
                  <div>
                    <p className="text-sm font-medium text-dark-900">{batch.batchName}</p>
                    <p className="text-xs text-dark-400">{batch.year} • Sem {batch.semester}</p>
                  </div>
                </div>
                <span className="text-xs text-dark-400">{batch.sectionCount || 0} sections</span>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
