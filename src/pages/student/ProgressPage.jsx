import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, TrendingDown, Minus, BookOpen, Target } from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import studentAPI from '../../api/student.api'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'

export default function StudentProgressPage() {
  const { data: progress, isLoading } = useQuery({
    queryKey: ['student-progress'],
    queryFn: () => studentAPI.getMyProgress().then((r) => r.data.data || r.data),
  })

  const subjects = progress?.subjects || progress?.subjectProgress || []
  const overall = progress?.overallProgress || progress?.averageMarks || 0

  const radarData = subjects.map((s) => ({
    subject: s.subject || s.name,
    score: s.progress || s.marks || s.averageMarks || 0,
  }))

  const barData = subjects.map((s) => ({
    name: (s.subject || s.name || '').slice(0, 10),
    marks: s.progress || s.marks || s.averageMarks || 0,
  }))

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-heading text-dark-900">My Progress</h1><p className="text-dark-500 text-sm mt-1">Track your academic performance</p></div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-6">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : !progress || subjects.length === 0 ? (
        <EmptyState icon={BarChart3} title="No progress data" description="Progress data will appear as you submit work and receive grades." />
      ) : (
        <>
          {/* Overall Score Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card hover={false} className="bg-gradient-to-r from-primary-600 to-primary-800 text-white border-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Overall Progress</p>
                  <p className="text-5xl font-bold font-heading">{overall}%</p>
                  <div className="flex items-center gap-2 mt-2">
                    {overall >= 75 ? <TrendingUp className="w-5 h-5 text-green-300" /> : overall >= 50 ? <Minus className="w-5 h-5 text-yellow-300" /> : <TrendingDown className="w-5 h-5 text-red-300" />}
                    <span className="text-sm text-white/70">{overall >= 75 ? 'Excellent' : overall >= 50 ? 'Good' : 'Needs Improvement'}</span>
                  </div>
                </div>
                <div className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center">
                  <Target className="w-10 h-10 text-white/40" />
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <Card hover={false}>
              <h3 className="text-lg font-semibold font-heading text-dark-900 mb-4">Subject Spread</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Radar dataKey="score" stroke="#1a56db" fill="#1a56db" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Bar Chart */}
            <Card hover={false}>
              <h3 className="text-lg font-semibold font-heading text-dark-900 mb-4">Subject-wise Marks</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="marks" fill="#1a56db" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Subject Cards */}
          <div>
            <h2 className="text-lg font-semibold font-heading text-dark-900 mb-4">Subject Details</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((sub, idx) => {
                const score = sub.progress || sub.marks || sub.averageMarks || 0
                return (
                  <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                    <Card>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center"><BookOpen className="w-4 h-4 text-blue-600" /></div>
                        <h4 className="font-semibold text-dark-900">{sub.subject || sub.name}</h4>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-dark-500">Score</span>
                        <span className={`text-sm font-bold ${score >= 75 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{score}%</span>
                      </div>
                      <div className="w-full h-2 bg-dark-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1, delay: 0.3 }}
                          className={`h-full rounded-full ${score >= 75 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
