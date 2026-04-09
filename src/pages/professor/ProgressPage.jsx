import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { BarChart3, User, BookOpen, Search, Plus, Calendar } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import toast from 'react-hot-toast'
import professorAPI from '../../api/professor.api'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { getInitials, formatDate } from '../../utils/formatters'

const progressSchema = z.object({
  percentage: z.string().min(1, 'Percentage required'),
  subject: z.string().min(1, 'Subject required'),
  progressNote: z.string().optional(),
})

export default function ProgressPage() {
  const queryClient = useQueryClient()
  const [studentId, setStudentId] = useState('')
  const [activeStudentId, setActiveStudentId] = useState('')
  const [addOpen, setAddOpen] = useState(false)

  const { data: progressRecords = [], isLoading } = useQuery({
    queryKey: ['prof-progress', activeStudentId],
    queryFn: () => professorAPI.getStudentProgress(activeStudentId).then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
    enabled: !!activeStudentId,
  })

  const form = useForm({ resolver: zodResolver(progressSchema) })

  const addMutation = useMutation({
    mutationFn: (data) => professorAPI.updateProgress(activeStudentId, { ...data, percentage: parseFloat(data.percentage) }),
    onSuccess: () => {
      toast.success('Progress updated!')
      queryClient.invalidateQueries({ queryKey: ['prof-progress', activeStudentId] })
      setAddOpen(false)
      form.reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const handleSearch = () => {
    if (studentId.trim()) {
      setActiveStudentId(studentId.trim())
    }
  }

  const chartData = progressRecords.map((r, i) => ({
    name: `Record ${i + 1}`,
    date: formatDate(r.date),
    percentage: r.percentage || 0,
    subject: r.subject,
  }))

  const studentName = progressRecords[0]?.studentName || 'Student'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold font-heading text-dark-900">Student Progress</h1><p className="text-dark-500 text-sm mt-1">Track and update academic progress</p></div>
        <Button icon={Plus} onClick={() => setAddOpen(true)} disabled={!activeStudentId}>Add Progress Entry</Button>
      </div>

      <Card hover={false}>
        <h3 className="text-sm font-semibold text-dark-700 mb-3">Lookup Student</h3>
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              type="text"
              placeholder="Enter Student UUID..."
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="input-field pl-10 w-full"
            />
          </div>
          <Button onClick={handleSearch} disabled={!studentId.trim()}>Search</Button>
        </div>
      </Card>

      {!activeStudentId ? (
        <EmptyState icon={BarChart3} title="Lookup a student" description="Enter a student UUID above to view their progress history." />
      ) : isLoading ? (
        <div className="grid sm:grid-cols-2 gap-6">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : progressRecords.length === 0 ? (
        <EmptyState icon={BarChart3} title="No progress data" description="No progress records found for this student. Add the first one!" action={<Button icon={Plus} onClick={() => setAddOpen(true)}>Add Entry</Button>} />
      ) : (
        <>
          {/* Chart */}
          <Card hover={false}>
            <h3 className="text-lg font-semibold font-heading text-dark-900 mb-4">{studentName}&apos;s Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="percentage" fill="#1a56db" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Timeline Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {progressRecords.map((r, idx) => (
              <motion.div key={r.id || idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <Card>
                  <div className="flex items-center justify-between mb-3 border-b border-dark-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-dark-400" />
                      <span className="text-sm font-medium text-dark-700">{formatDate(r.date)}</span>
                    </div>
                    <span className={`text-lg font-bold ${r.percentage >= 75 ? 'text-green-600' : r.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {r.percentage}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-dark-900 font-medium mb-2">
                    <BookOpen className="w-4 h-4 text-blue-500" /> {r.subject}
                  </div>
                  {r.progressNote && <p className="text-sm text-dark-500 mb-3">{r.progressNote}</p>}
                  <div className="text-xs text-dark-400 text-right mt-2">Added by: {r.updatedByName}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Add Progress Modal */}
      <Modal isOpen={addOpen} onClose={() => { setAddOpen(false); form.reset() }} title={`Add Progress Entry`} footer={<><Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={form.handleSubmit((d) => addMutation.mutate(d))} loading={addMutation.isPending}>Save</Button></>}>
        <form className="space-y-4">
          <Input label="Subject" placeholder="e.g. Data Structures" error={form.formState.errors.subject?.message} {...form.register('subject')} />
          <Input label="Percentage (0-100)" type="number" step="0.1" error={form.formState.errors.percentage?.message} {...form.register('percentage')} />
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Note (Optional)</label>
            <textarea className="input-field min-h-[80px] resize-y" placeholder="Any remarks on performance..." {...form.register('progressNote')} />
          </div>
        </form>
      </Modal>
    </div>
  )
}
