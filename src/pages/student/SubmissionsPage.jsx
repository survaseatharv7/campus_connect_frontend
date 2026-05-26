import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ClipboardList, Upload, Calendar, FileText, CheckCircle, Clock, User, BookOpen, AlertCircle, X } from 'lucide-react'
import toast from 'react-hot-toast'
import studentAPI from '../../api/student.api'
import { uploadSubmission } from '../../api/upload.api'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import SearchSelect from '../../components/ui/SearchSelect'
import FileUpload from '../../components/ui/FileUpload'
import EmptyState from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { SUBMISSION_STATUS_COLORS } from '../../utils/constants'
import { formatDate, formatEnumLabel, fixCloudinaryUrl } from '../../utils/formatters'
import useAuth from '../../hooks/useAuth'

const customFormatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const submitSchema = z.object({
  submissionType: z.string().min(1, 'Type required'),
  description: z.string().optional(),
  fileUrl: z.string().min(1, 'File is required'),
  teamName: z.string().optional(),
  teamMemberIds: z.array(z.string()).optional(),
})

export default function StudentSubmissionsPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('PENDING') // PENDING or HISTORY
  const [selectedSection, setSelectedSection] = useState(null)

  // Fetch student's submissions
  const { data: submissions = [], isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ['student-submissions'],
    queryFn: () => studentAPI.getMySubmissions().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  // Fetch student's available sections (assignments)
  const { data: sections = [], isLoading: isLoadingSections } = useQuery({
    queryKey: ['student-sections'],
    queryFn: () => studentAPI.getSections().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const { user } = useAuth()
  const form = useForm({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      submissionType: 'INDIVIDUAL',
      description: '',
      fileUrl: '',
      teamName: '',
      teamMemberIds: [],
    }
  })

  const submissionType = form.watch('submissionType')
  const teamMemberIds = form.watch('teamMemberIds') || []

  // Fetch student's classmates/students
  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students-list'],
    queryFn: () => studentAPI.getStudents().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const availableStudents = students.filter(s => s.id !== user?.id)

  const submitMutation = useMutation({
    mutationFn: (data) => studentAPI.submitWork(selectedSection.id, data),
    onSuccess: (_, variables) => {
      const isTeam = variables.submissionType === 'TEAM'
      toast.success(isTeam ? 'Submitted for you and your team!' : 'Work submitted successfully!')
      queryClient.invalidateQueries({ queryKey: ['student-submissions'] })
      setSelectedSection(null)
      form.reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to submit work'),
  })

  const isDeadlinePassed = (deadlineDate) => {
    if (!deadlineDate) return false
    return new Date(deadlineDate) < new Date()
  }

  const getDeadlineStatus = (deadlineDate) => {
    if (!deadlineDate) return null
    const date = new Date(deadlineDate)
    const now = new Date()
    const diff = date - now
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    if (diff < 0) return { label: 'Deadline Passed', color: 'red' }
    if (days <= 2) return { label: `Due in ${days} days`, color: 'amber' }
    return { label: `Due: ${customFormatDate(deadlineDate)}`, color: 'blue' }
  }

  const hasSubmitted = (sectionId) => submissions.some(s => s.sectionId === sectionId || s.section?.id === sectionId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-dark-900">Submissions</h1>
          <p className="text-dark-500 text-sm mt-1">Manage your assignments and project submissions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-dark-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'PENDING'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-dark-500 hover:text-dark-700'
            }`}
        >
          Pending Tasks
        </button>
        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'HISTORY'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-dark-500 hover:text-dark-700'
            }`}
        >
          Submission History
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'PENDING' ? (
          <motion.div
            key="pending"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {isLoadingSections ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : sections.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No assignments found"
                description="You don't have any pending assignments or sections to submit to."
              />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections
                  .filter(section => !hasSubmitted(section.id))
                  .sort((a, b) => {
                    if (!a.deadlineDate) return 1
                    if (!b.deadlineDate) return -1
                    return new Date(a.deadlineDate) - new Date(b.deadlineDate)
                  })
                  .map((section, idx) => {
                    const deadlineStatus = getDeadlineStatus(section.deadlineDate)
                    const submitted = false // Since we've filtered, should always be false here

                    return (
                      <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Card className="h-full flex flex-col">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                              <BookOpen className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge color="blue" size="sm">{formatEnumLabel(section.sectionType)}</Badge>
                              {submitted && <Badge color="green" size="sm" icon={CheckCircle}>Submitted</Badge>}
                            </div>
                          </div>

                          <div className="mb-2">
                            <p className="text-xs font-bold text-primary-600 uppercase tracking-wider">{section.batchName || 'General Batch'}</p>
                            <h3 className="text-lg font-bold font-heading text-dark-900">{section.title}</h3>
                          </div>

                          <p className="text-sm text-dark-500 mb-4 line-clamp-3 overflow-hidden flex-grow">{section.description}</p>

                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-dark-600">
                              <User className="w-4 h-4 text-dark-400" />
                              <span>Prof. {section.teacherName || 'TBA'}</span>
                            </div>
                            {deadlineStatus ? (
                              <div className={`flex items-center gap-2 text-sm font-medium text-${deadlineStatus.color}-600`}>
                                <Clock className="w-4 h-4" />
                                <span>{deadlineStatus.label}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-sm text-dark-400">
                                <Clock className="w-4 h-4" />
                                <span>No deadline</span>
                              </div>
                            )}
                          </div>

                          <Button
                            fullWidth
                            variant={submitted ? "secondary" : "primary"}
                            icon={submitted ? CheckCircle : Upload}
                            onClick={() => setSelectedSection(section)}
                            disabled={isDeadlinePassed(section.deadlineDate) && !submitted}
                          >
                            {submitted ? "Resubmit Work" : "Submit Work"}
                          </Button>
                        </Card>
                      </motion.div>
                    )
                  })}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {isLoadingSubmissions ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : submissions.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="No submissions yet"
                description="Start submitting your work to see your history here."
                action={<Button onClick={() => setActiveTab('PENDING')}>View Assignments</Button>}
              />
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {submissions.map((sub, idx) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card>
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                          <ClipboardList className="w-5 h-5" />
                        </div>
                        <Badge color={SUBMISSION_STATUS_COLORS[sub.status] || 'gray'} size="sm" dot>
                          {formatEnumLabel(sub.status || 'SUBMITTED')}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-bold font-heading text-dark-900 mb-1">
                        {sub.sectionTitle || sub.section?.title || formatEnumLabel(sub.submissionType || 'SUBMISSION')}
                      </h3>
                      {sub.teamName && (
                        <p className="text-xs font-semibold text-primary-600 mb-2 px-2 py-0.5 bg-primary-50 rounded-md w-fit">
                          Team: {sub.teamName}
                        </p>
                      )}
                      <p className="text-sm text-dark-500 mb-4 line-clamp-2">{sub.description}</p>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-xs text-dark-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(sub.submittedAt || sub.createdAt)}
                        </div>
                        {sub.fileUrl && (
                          <a
                            href={fixCloudinaryUrl(sub.fileUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary-600 hover:underline flex items-center gap-1 font-medium"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            View Attached File
                          </a>
                        )}
                      </div>

                      {sub.professorRemark && (
                        <div className="px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">
                          <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Professor Remarks</p>
                          <p className="text-sm text-blue-700 leading-relaxed">{sub.professorRemark}</p>
                          {sub.reviewedByName && (
                            <p className="text-xs text-blue-500 mt-2 font-medium">— {sub.reviewedByName}</p>
                          )}
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submission Modal */}
      <Modal
        isOpen={!!selectedSection}
        onClose={() => { setSelectedSection(null); form.reset() }}
        title={`Submit: ${selectedSection?.title}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedSection(null)}>Cancel</Button>
            <Button
              onClick={form.handleSubmit((d) => submitMutation.mutate(d))}
              loading={submitMutation.isPending}
              disabled={submissionType === 'TEAM' && teamMemberIds.length === 0}
            >
              {submissionType === 'TEAM' ? 'Submit for Team' : 'Submit Work'}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="p-4 bg-dark-50 rounded-xl border border-dark-100 flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-dark-400" />
            <div>
              <p className="text-xs text-dark-500 font-medium">Submitting for</p>
              <p className="text-sm font-bold text-dark-800">{selectedSection?.title}</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-dark-700">Submission Mode</label>
            <div className="flex p-1 bg-dark-100 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => {
                  form.setValue('submissionType', 'INDIVIDUAL')
                  form.setValue('teamMemberIds', [])
                }}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${submissionType === 'INDIVIDUAL'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-dark-500 hover:text-dark-700'
                  }`}
              >
                Individual
              </button>
              {selectedSection?.sectionType === 'PROJECT' && (
                <button
                  type="button"
                  onClick={() => form.setValue('submissionType', 'TEAM')}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${submissionType === 'TEAM'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-dark-500 hover:text-dark-700'
                    }`}
                >
                  Team
                </button>
              )}
            </div>
            {submissionType === "TEAM" ? (
              <p className="text-xs text-yellow-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                This will be submitted for all selected members
              </p>
            ) : (
              <p className="text-xs text-dark-500">
                Defaulting to INDIVIDUAL submission
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-2">Category</label>
            <select className="input-field" {...form.register('description')} defaultValue="ASSIGNMENT">
              <option value="ASSIGNMENT">Assignment</option>
              <option value="PROJECT">Project</option>
              <option value="PRESENTATION">Presentation</option>
              <option value="EXAM">Exam</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-dark-700 mb-2">Description / Notes</label>
            <textarea
              className="input-field min-h-[100px] resize-y"
              placeholder="Provide any relevant details about your submission..."
              {...form.register('description')}
            />
          </div>

          <FileUpload
            label="Upload Submission File"
            accept="*"
            uploadFn={uploadSubmission}
            onUpload={(url) => form.setValue('fileUrl', url, { shouldValidate: true, shouldDirty: true })}
            value={form.watch('fileUrl')}
            maxSizeMB={20}
            error={form.formState.errors.fileUrl?.message}
          />

          {submissionType === 'TEAM' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 pt-2"
            >
              <Input
                label="Team Name"
                placeholder="e.g. Frontend Squad"
                {...form.register('teamName')}
              />

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-dark-700">Add Team Members</label>
                <SearchSelect
                  placeholder="Search students..."
                  options={availableStudents.filter(s => !teamMemberIds.includes(s.id))}
                  onChange={(val) => {
                    if (val && !teamMemberIds.includes(val)) {
                      form.setValue('teamMemberIds', [...teamMemberIds, val])
                    }
                  }}
                  displayValue={(s) => s.name}
                  renderOption={(s) => (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-[10px] font-bold">
                        {s.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{s.name}</span>
                        <span className="text-[10px] text-dark-400">{s.email}</span>
                      </div>
                    </div>
                  )}
                />

                <div className="flex flex-wrap gap-2 mt-2">
                  {teamMemberIds.map(id => {
                    const student = students.find(s => s.id === id)
                    return (
                      <Badge
                        key={id}
                        variant="primary"
                        icon={X}
                        onClick={() => form.setValue('teamMemberIds', teamMemberIds.filter(mId => mId !== id))}
                        className="cursor-pointer hover:bg-primary-100 transition-colors"
                      >
                        {student?.name || 'Unknown Student'}
                      </Badge>
                    )
                  })}
                </div>
                {submissionType === 'TEAM' && teamMemberIds.length === 0 && (
                  <p className="text-[10px] text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> At least 1 teammate required for team submission
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </Modal>
    </div>
  )
}

