import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  BookOpen, Plus, Users, Layers, Edit2, Trash2, 
  ChevronDown, ChevronUp, Clock, CheckCircle2, 
  AlertCircle, Calendar, GraduationCap
} from 'lucide-react'
import toast from 'react-hot-toast'
import professorAPI from '../../api/professor.api'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import EmptyState from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { ACADEMIC_YEARS, SEMESTERS } from '../../utils/constants'
import { BATCH_SECTION_TYPES } from '../../utils/enums'
import { format } from 'date-fns'

const batchSchema = z.object({
  batchName: z.string().min(2, 'Name required'),
  year: z.string().min(1, 'Year required'),
  semester: z.string().min(1, 'Semester required'),
})

const sectionSchema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  sectionType: z.enum(['PROJECT', 'SEMINAR', 'INTERNSHIP'], {
    errorMap: () => ({ message: 'Invalid section type' })
  }),
  deadlineDate: z.string().optional(),
})

// Helper component for Section Card
function SectionCard({ section, onEdit, onDelete }) {
  const isExpired = section.deadlineDate && new Date(section.deadlineDate) < new Date()
  
  return (
    <Card className="bg-white/50 border-dark-100 hover:border-blue-200 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-dark-900">{section.title}</h4>
            <Badge 
              color={
                section.sectionType === 'PROJECT' ? 'blue' : 
                section.sectionType === 'SEMINAR' ? 'purple' : 'orange'
              } 
              size="sm"
            >
              {section.sectionType}
            </Badge>
          </div>
          {section.description && (
            <p className="text-sm text-dark-500 mb-2 line-clamp-1">{section.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-dark-500">
              <Users className="w-3.5 h-3.5" />
              <span>{section.submissionCount || 0} Submissions</span>
            </div>
            {section.deadlineDate && (
              <div className={`flex items-center gap-1.5 ${isExpired ? 'text-red-500 font-medium' : 'text-dark-500'}`}>
                <Clock className="w-3.5 h-3.5" />
                <span>Deadline: {format(new Date(section.deadlineDate), 'dd MMM yyyy')}</span>
                {isExpired && <AlertCircle className="w-3.5 h-3.5" />}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit(section)}
            className="p-2 text-dark-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Section"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(section)}
            className="p-2 text-dark-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            disabled={section.submissionCount > 0}
            title={section.submissionCount > 0 ? "Cannot delete section with submissions" : "Delete Section"}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  )
}

// Helper component for Sections List
function SectionsList({ batchId, onEditSection, onDeleteSection }) {
  const { data: sections = [], isLoading } = useQuery({
    queryKey: ['sections', batchId],
    queryFn: () => professorAPI.getSections(batchId).then(r => r.data.data || r.data || []),
  })

  if (isLoading) return <div className="space-y-3 py-4">{[1, 2].map(i => <div key={i} className="h-20 bg-dark-50 animate-pulse rounded-xl" />)}</div>

  if (sections.length === 0) return (
    <div className="py-8 text-center bg-dark-50/50 rounded-xl border-2 border-dashed border-dark-100">
      <Layers className="w-8 h-8 text-dark-300 mx-auto mb-2" />
      <p className="text-sm text-dark-500">No sections added yet</p>
    </div>
  )

  return (
    <div className="space-y-3 py-4">
      {sections.map(section => (
        <SectionCard 
          key={section.id} 
          section={section} 
          onEdit={onEditSection}
          onDelete={onDeleteSection}
        />
      ))}
    </div>
  )
}

export default function BatchesPage() {
  const queryClient = useQueryClient()
  
  // State for Modals
  const [batchModal, setBatchModal] = useState({ open: false, mode: 'create', data: null })
  const [sectionModal, setSectionModal] = useState({ open: false, mode: 'create', data: null, batchId: null })
  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', id: null, title: '' })
  const [expandedBatchId, setExpandedBatchId] = useState(null)

  const { data: batches = [], isLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: () => professorAPI.getBatches().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const batchForm = useForm({ 
    resolver: zodResolver(batchSchema),
    defaultValues: { batchName: '', year: '', semester: '' }
  })
  
  const sectionForm = useForm({ 
    resolver: zodResolver(sectionSchema),
    defaultValues: { title: '', description: '', sectionType: '', deadlineDate: '' }
  })

  // Batch Mutations
  const batchMutation = useMutation({
    mutationFn: (data) => {
      const payload = { ...data, year: parseInt(data.year), semester: parseInt(data.semester) }
      return batchModal.mode === 'create' 
        ? professorAPI.createBatch(payload)
        : professorAPI.updateBatch(batchModal.data.id, payload)
    },
    onSuccess: () => {
      toast.success(`Batch ${batchModal.mode === 'create' ? 'created' : 'updated'}!`)
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      setBatchModal({ open: false, mode: 'create', data: null })
      batchForm.reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Action failed'),
  })

  const deleteBatchMutation = useMutation({
    mutationFn: (id) => professorAPI.deleteBatch(id),
    onSuccess: () => {
      toast.success('Batch deleted!')
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      setDeleteModal({ open: false, type: '', id: null, title: '' })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete batch'),
  })

  // Section Mutations
  const sectionMutation = useMutation({
    mutationFn: (data) => {
      return sectionModal.mode === 'create'
        ? professorAPI.createSection(sectionModal.batchId, data)
        : professorAPI.updateSection(sectionModal.data.id, data)
    },
    onSuccess: () => {
      toast.success(`Section ${sectionModal.mode === 'create' ? 'added' : 'updated'}!`)
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      queryClient.invalidateQueries({ queryKey: ['sections', sectionModal.batchId || sectionModal.data?.batchId] })
      setSectionModal({ open: false, mode: 'create', data: null, batchId: null })
      sectionForm.reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Action failed'),
  })

  const deleteSectionMutation = useMutation({
    mutationFn: (id) => professorAPI.deleteSection(id),
    onSuccess: () => {
      toast.success('Section deleted!')
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      queryClient.invalidateQueries({ queryKey: ['sections'] }) // Simple invalidation for all sections
      setDeleteModal({ open: false, type: '', id: null, title: '' })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete section'),
  })

  // Handlers
  const handleEditBatch = (batch) => {
    batchForm.reset({
      batchName: batch.batchName,
      year: batch.year.toString(),
      semester: batch.semester.toString()
    })
    setBatchModal({ open: true, mode: 'edit', data: batch })
  }

  const handleEditSection = (section) => {
    sectionForm.reset({
      title: section.title,
      description: section.description || '',
      sectionType: section.sectionType,
      deadlineDate: section.deadlineDate ? section.deadlineDate.split('T')[0] : ''
    })
    setSectionModal({ open: true, mode: 'edit', data: section, batchId: section.batchId })
  }

  const handleDeleteConfirm = () => {
    if (deleteModal.type === 'batch') {
      deleteBatchMutation.mutate(deleteModal.id)
    } else {
      deleteSectionMutation.mutate(deleteModal.id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-dark-900">My Batches</h1>
          <p className="text-dark-500 text-sm mt-1">Manage your teaching batches and assignment sections</p>
        </div>
        <Button 
          icon={Plus} 
          onClick={() => {
            batchForm.reset({ batchName: '', year: '', semester: '' })
            setBatchModal({ open: true, mode: 'create', data: null })
          }}
        >
          Create Batch
        </Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : batches.length === 0 ? (
        <EmptyState 
          icon={BookOpen} 
          title="No batches" 
          description="You haven't created any batches yet." 
          action={
            <Button icon={Plus} onClick={() => setBatchModal({ open: true, mode: 'create', data: null })}>
              Create First Batch
            </Button>
          } 
        />
      ) : (
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
          {batches.map((batch, idx) => {
            const isExpanded = expandedBatchId === batch.id
            return (
              <motion.div 
                key={batch.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.05 }}
              >
                <Card className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-blue-500 border-transparent shadow-lg' : 'hover:border-blue-200'}`}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                          <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold font-heading text-dark-900">{batch.batchName}</h3>
                            <Badge color="blue" variant="soft" size="sm">Sem {batch.semester}</Badge>
                          </div>
                          <p className="text-sm text-dark-500 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            AY {batch.year}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleEditBatch(batch)}
                          className="p-2 text-dark-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Batch"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteModal({ open: true, type: 'batch', id: batch.id, title: batch.batchName })}
                          className="p-2 text-dark-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          disabled={batch.sectionCount > 0}
                          title={batch.sectionCount > 0 ? "Cannot delete batch with sections" : "Delete Batch"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-6">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-dark-400 uppercase tracking-wider font-semibold">Sections</span>
                          <span className="text-lg font-bold text-dark-700">{batch.sectionCount || 0}</span>
                        </div>
                        <div className="w-px h-8 bg-dark-100" />
                        <div className="flex flex-col">
                          <span className="text-xs text-dark-400 uppercase tracking-wider font-semibold">Total Submissions</span>
                          <span className="text-lg font-bold text-dark-700">{batch.totalSubmissions || 0}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={isExpanded ? ChevronUp : ChevronDown}
                          onClick={() => setExpandedBatchId(isExpanded ? null : batch.id)}
                          className={isExpanded ? 'text-blue-600 bg-blue-50' : ''}
                        >
                          {isExpanded ? 'Hide Sections' : 'View Sections'}
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          icon={Plus}
                          onClick={() => {
                            sectionForm.reset({ title: '', description: '', sectionType: '', deadlineDate: '' })
                            setSectionModal({ open: true, mode: 'create', data: null, batchId: batch.id })
                          }}
                        >
                          Add Section
                        </Button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-6 border-t border-dark-100"
                        >
                          <SectionsList 
                            batchId={batch.id} 
                            onEditSection={handleEditSection}
                            onDeleteSection={(s) => setDeleteModal({ open: true, type: 'section', id: s.id, title: s.title })}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Batch Modal (Create/Edit) */}
      <Modal 
        isOpen={batchModal.open} 
        onClose={() => setBatchModal(p => ({ ...p, open: false }))} 
        title={batchModal.mode === 'create' ? "Create New Batch" : "Edit Batch"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setBatchModal(p => ({ ...p, open: false }))}>Cancel</Button>
            <Button 
              onClick={batchForm.handleSubmit((d) => batchMutation.mutate(d))} 
              loading={batchMutation.isPending}
            >
              {batchModal.mode === 'create' ? 'Create Batch' : 'Update Batch'}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input 
            label="Batch Name" 
            placeholder="e.g. CS 2024 Batch A" 
            error={batchForm.formState.errors.batchName?.message} 
            {...batchForm.register('batchName')} 
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Academic Year</label>
              <select className="input-field" {...batchForm.register('year')}>
                <option value="">Select Year</option>
                {ACADEMIC_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              {batchForm.formState.errors.year && <p className="mt-1 text-sm text-red-500">{batchForm.formState.errors.year.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Semester</label>
              <select className="input-field" {...batchForm.register('semester')}>
                <option value="">Select Sem</option>
                {SEMESTERS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              {batchForm.formState.errors.semester && <p className="mt-1 text-sm text-red-500">{batchForm.formState.errors.semester.message}</p>}
            </div>
          </div>
        </form>
      </Modal>

      {/* Section Modal (Add/Edit) */}
      <Modal 
        isOpen={sectionModal.open} 
        onClose={() => setSectionModal(p => ({ ...p, open: false }))} 
        title={sectionModal.mode === 'create' ? "Add New Section" : "Edit Section"}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSectionModal(p => ({ ...p, open: false }))}>Cancel</Button>
            <Button 
              onClick={sectionForm.handleSubmit((d) => sectionMutation.mutate(d))} 
              loading={sectionMutation.isPending}
            >
              {sectionModal.mode === 'create' ? 'Add Section' : 'Update Section'}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input 
            label="Section Title" 
            placeholder="e.g. Project Proposal Submission" 
            error={sectionForm.formState.errors.title?.message} 
            {...sectionForm.register('title')} 
          />
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Description (Optional)</label>
            <textarea 
              className="input-field min-h-[100px] resize-y" 
              placeholder="Provide instructions for this section..." 
              {...sectionForm.register('description')} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Section Type</label>
              <select className="input-field" {...sectionForm.register('sectionType')}>
                <option value="">Select Type</option>
                {BATCH_SECTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              {sectionForm.formState.errors.sectionType && <p className="mt-1 text-sm text-red-500">{sectionForm.formState.errors.sectionType.message}</p>}
            </div>
            <Input 
              label="Deadline Date" 
              type="date" 
              error={sectionForm.formState.errors.deadlineDate?.message} 
              {...sectionForm.register('deadlineDate')} 
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, type: '', id: null, title: '' })}
        title={`Delete ${deleteModal.type === 'batch' ? 'Batch' : 'Section'}`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModal({ open: false, type: '', id: null, title: '' })}>Cancel</Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteConfirm}
              loading={deleteBatchMutation.isPending || deleteSectionMutation.isPending}
            >
              Delete
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-4 p-1">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-dark-900 font-medium">Are you sure you want to delete this {deleteModal.type}?</p>
            <p className="text-dark-500 text-sm mt-1">
              You are about to delete <span className="font-semibold text-dark-700">"{deleteModal.title}"</span>. This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
