import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ClipboardList, FileText, Download, User, Calendar, MessageSquare, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import professorAPI from '../../api/professor.api'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import EmptyState from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { formatDate, formatEnumLabel } from '../../utils/formatters'
import { SUBMISSION_STATUS_COLORS } from '../../utils/constants'

const remarkSchema = z.object({
  remark: z.string().min(2, 'Remark is required'),
  status: z.string().min(1, 'Status is required'),
})

export default function SubmissionsPage() {
  const queryClient = useQueryClient()
  const [sectionId, setSectionId] = useState('')
  const [activeSectionId, setActiveSectionId] = useState('')
  const [remarkOpen, setRemarkOpen] = useState(false)
  const [selectedSub, setSelectedSub] = useState(null)

  // Fetch batches to let professor pick a section
  const { data: batches = [] } = useQuery({
    queryKey: ['prof-batches'],
    queryFn: () => professorAPI.getBatches().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  // Fetch sections for selected batch
  const [selectedBatchId, setSelectedBatchId] = useState('')
  const { data: sections = [] } = useQuery({
    queryKey: ['prof-sections', selectedBatchId],
    queryFn: () => professorAPI.getSections(selectedBatchId).then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
    enabled: !!selectedBatchId,
  })

  // Fetch submissions for the selected section
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['prof-submissions', activeSectionId],
    queryFn: () => professorAPI.getSubmissions(activeSectionId).then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
    enabled: !!activeSectionId,
  })

  const remarkForm = useForm({ resolver: zodResolver(remarkSchema) })

  const remarkMutation = useMutation({
    mutationFn: ({ id, data }) => professorAPI.addRemark(id, data),
    onSuccess: () => {
      toast.success('Remark added!')
      queryClient.invalidateQueries({ queryKey: ['prof-submissions', activeSectionId] })
      setRemarkOpen(false)
      setSelectedSub(null)
      remarkForm.reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add remark'),
  })

  const handleSearch = () => {
    if (sectionId.trim()) {
      setActiveSectionId(sectionId.trim())
    }
  }

  const handleSectionSelect = (secId) => {
    setSectionId(secId)
    setActiveSectionId(secId)
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-heading text-dark-900">Student Submissions</h1><p className="text-dark-500 text-sm mt-1">Review and remark on student work submissions</p></div>

      {/* Batch & Section Selector */}
      <Card hover={false}>
        <h3 className="text-sm font-semibold text-dark-700 mb-3">Select Batch & Section</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Batch</label>
            <select
              className="input-field"
              value={selectedBatchId}
              onChange={(e) => { setSelectedBatchId(e.target.value); setActiveSectionId(''); setSectionId('') }}
            >
              <option value="">Select batch</option>
              {batches.map((b) => <option key={b.id} value={b.id}>{b.batchName} — Sem {b.semester}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Section</label>
            <select
              className="input-field"
              value={activeSectionId}
              onChange={(e) => handleSectionSelect(e.target.value)}
              disabled={!selectedBatchId}
            >
              <option value="">Select section</option>
              {sections.map((s) => <option key={s.id} value={s.id}>{s.title} ({formatEnumLabel(s.sectionType)})</option>)}
            </select>
          </div>
        </div>
        <p className="text-xs text-dark-400">Or enter a section ID manually:</p>
        <div className="flex gap-2 mt-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              type="text"
              placeholder="Enter Section UUID..."
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="input-field pl-10 w-full"
            />
          </div>
          <Button size="sm" onClick={handleSearch} disabled={!sectionId.trim()}>Load</Button>
        </div>
      </Card>

      {/* Submissions */}
      {!activeSectionId ? (
        <EmptyState icon={ClipboardList} title="Select a section" description="Choose a batch and section above to view submissions." />
      ) : isLoading ? (
        <div className="grid sm:grid-cols-2 gap-6">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : submissions.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No submissions" description="No student submissions for this section yet." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {submissions.map((sub, idx) => (
            <motion.div key={sub.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center"><ClipboardList className="w-5 h-5 text-purple-600" /></div>
                  <Badge color={SUBMISSION_STATUS_COLORS[sub.status] || 'gray'} size="sm" dot>{formatEnumLabel(sub.status || 'SUBMITTED')}</Badge>
                </div>
                <h3 className="text-lg font-semibold font-heading text-dark-900 mb-1">{sub.submissionType ? formatEnumLabel(sub.submissionType) : 'Submission'}</h3>
                <p className="text-sm text-dark-500 mb-3 line-clamp-2">{sub.description}</p>
                <div className="space-y-1.5 text-sm text-dark-500 mb-4">
                  <div className="flex items-center gap-2 font-semibold text-dark-900">
                    <User className="w-4 h-4 text-dark-400" />
                    Leader: {sub.studentName || 'Student'}
                  </div>
                  {sub.submissionType === 'TEAM' && sub.teamMemberNames && (
                    <p className="text-sm text-dark-500 ml-6">
                      Team: {sub.teamMemberNames.join(", ")}
                    </p>
                  )}
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-dark-400" />{formatDate(sub.submittedAt)}</div>
                </div>
                {sub.professorRemark && (
                  <div className="mb-3 px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-700">
                    <span className="font-medium">Remark:</span> {sub.professorRemark}
                    {sub.reviewedByName && <span className="text-xs text-blue-500 ml-2">— {sub.reviewedByName}</span>}
                  </div>
                )}
                <div className="flex gap-2">
                  {sub.fileUrl && (
                    <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium">
                      <Download className="w-4 h-4" /> View File
                    </a>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={MessageSquare}
                    className="ml-auto"
                    onClick={() => { setSelectedSub(sub); setRemarkOpen(true); remarkForm.reset({ remark: sub.professorRemark || '', status: sub.status || 'SUBMITTED' }) }}
                  >
                    {sub.professorRemark ? 'Edit Remark' : 'Add Remark'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Remark Modal */}
      <Modal
        isOpen={remarkOpen}
        onClose={() => { setRemarkOpen(false); setSelectedSub(null); remarkForm.reset() }}
        title={`Remark — ${selectedSub?.studentName || 'Student'}`}
        footer={<><Button variant="secondary" onClick={() => setRemarkOpen(false)}>Cancel</Button><Button onClick={remarkForm.handleSubmit((d) => remarkMutation.mutate({ id: selectedSub?.id, data: d }))} loading={remarkMutation.isPending}>Save Remark</Button></>}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Status</label>
            <select className="input-field" {...remarkForm.register('status')}>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            {remarkForm.formState.errors.status && <p className="mt-1 text-sm text-red-500">{remarkForm.formState.errors.status.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Remark</label>
            <textarea className="input-field min-h-[100px] resize-y" placeholder="Write your feedback..." {...remarkForm.register('remark')} />
            {remarkForm.formState.errors.remark?.message && <p className="mt-1 text-sm text-red-500">{remarkForm.formState.errors.remark.message}</p>}
          </div>
        </form>
      </Modal>
    </div>
  )
}
