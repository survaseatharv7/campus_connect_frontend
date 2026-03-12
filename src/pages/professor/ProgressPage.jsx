import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { BarChart3, User, BookOpen, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import professorAPI from '../../api/professor.api'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { getInitials } from '../../utils/formatters'

export default function ProgressPage() {
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['prof-progress'],
    queryFn: () => professorAPI.getStudentProgress().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const chartData = students.slice(0, 10).map((s) => ({
    name: s.name?.split(' ')[0] || 'Student',
    progress: s.overallProgress || s.averageMarks || 0,
  }))

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-heading text-dark-900">Student Progress</h1><p className="text-dark-500 text-sm mt-1">Track academic progress of your students</p></div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : students.length === 0 ? (
        <EmptyState icon={BarChart3} title="No progress data" description="Track student progress once students start submitting work." />
      ) : (
        <>
          {/* Chart */}
          <Card hover={false}>
            <h3 className="text-lg font-semibold font-heading text-dark-900 mb-4">Progress Overview (Top 10)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="progress" fill="#1a56db" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Student Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student, idx) => {
              const progress = student.overallProgress || student.averageMarks || 0
              const trend = progress >= 75 ? 'up' : progress >= 50 ? 'neutral' : 'down'
              return (
                <motion.div key={student.id || idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                  <Card>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-sm">
                        {getInitials(student.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-dark-900">{student.name}</p>
                        <p className="text-xs text-dark-400">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-dark-500">Overall Progress</span>
                      <div className="flex items-center gap-1">
                        {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                        {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                        {trend === 'neutral' && <Minus className="w-4 h-4 text-yellow-500" />}
                        <span className={`text-sm font-semibold ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-yellow-600'}`}>
                          {progress}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-dark-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className={`h-full rounded-full ${progress >= 75 ? 'bg-green-500' : progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      />
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
