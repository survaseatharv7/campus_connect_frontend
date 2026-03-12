import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ClipboardList, Upload, Calendar, FileText, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import studentAPI from '../../api/student.api'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import EmptyState from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { SUBMISSION_STATUS_COLORS } from '../../utils/constants'
import { formatDate, formatEnumLabel } from '../../utils/formatters'

const submitSchema = z.object({
  title: z.string().min(2, 'Title required'),
  description: z.string().optional(),
  fileUrl: z.string().url('Valid URL required'),
  subject: z.string().min(2, 'Subject required'),
})

export default function StudentSubmissionsPage() {
  const queryClient = useQueryClient()
  const [submitOpen, setSubmitOpen] = useState(false)

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['student-submissions'],
    queryFn: () => studentAPI.getMySubmissions().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const form = useForm({ resolver: zodResolver(submitSchema) })

  const submitMutation = useMutation({
    mutationFn: (data) => studentAPI.submitWork(data),
    onSuccess: () => { toast.success('Work submitted!'); queryClient.invalidateQueries({ queryKey: ['student-submissions'] }); setSubmitOpen(false); form.reset() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold font-heading text-dark-900">My Submissions</h1><p className="text-dark-500 text-sm mt-1">Submit and track your work</p></div>
        <Button icon={Upload} onClick={() => setSubmitOpen(true)}>Submit Work</Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-6">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : submissions.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No submissions" description="Submit your first assignment." action={<Button icon={Upload} onClick={() => setSubmitOpen(true)}>Submit Work</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {submissions.map((sub, idx) => (
            <motion.div key={sub.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center"><ClipboardList className="w-5 h-5 text-purple-600" /></div>
                  <Badge color={SUBMISSION_STATUS_COLORS[sub.status] || 'gray'} size="sm" dot>{formatEnumLabel(sub.status || 'SUBMITTED')}</Badge>
                </div>
                <h3 className="text-lg font-semibold font-heading text-dark-900 mb-1">{sub.title}</h3>
                <p className="text-sm text-dark-500 mb-3 line-clamp-2">{sub.description}</p>
                <div className="text-xs text-dark-400 flex items-center gap-1 mb-3"><Calendar className="w-3 h-3" /> Submitted: {formatDate(sub.submittedAt || sub.createdAt)}</div>
                {sub.marks !== undefined && sub.marks !== null && (
                  <div className="px-3 py-2 rounded-xl bg-green-50 border border-green-100 flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Marks: {sub.marks}{sub.totalMarks ? ` / ${sub.totalMarks}` : ''}</span>
                  </div>
                )}
                {sub.remarks && (
                  <div className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-700">
                    <span className="font-medium">Remarks:</span> {sub.remarks}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={submitOpen} onClose={() => { setSubmitOpen(false); form.reset() }} title="Submit Work" footer={<><Button variant="secondary" onClick={() => setSubmitOpen(false)}>Cancel</Button><Button onClick={form.handleSubmit((d) => submitMutation.mutate(d))} loading={submitMutation.isPending}>Submit</Button></>}>
        <form className="space-y-4">
          <Input label="Title" placeholder="e.g. Assignment 1 - Linked Lists" error={form.formState.errors.title?.message} {...form.register('title')} />
          <Input label="Subject" placeholder="e.g. Data Structures" error={form.formState.errors.subject?.message} {...form.register('subject')} />
          <div><label className="block text-sm font-medium text-dark-700 mb-1.5">Description (Optional)</label><textarea className="input-field min-h-[80px] resize-y" placeholder="Brief description..." {...form.register('description')} /></div>
          <Input label="File URL" placeholder="https://firebase.storage/..." error={form.formState.errors.fileUrl?.message} {...form.register('fileUrl')} />
        </form>
      </Modal>
    </div>
  )
}
