import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { BookOpen, Plus, Users, Layers } from 'lucide-react'
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

const batchSchema = z.object({
  name: z.string().min(2, 'Name required'),
  year: z.string().min(1, 'Year required'),
  semester: z.string().min(1, 'Semester required'),
  subject: z.string().min(2, 'Subject required'),
})

const sectionSchema = z.object({
  name: z.string().min(1, 'Section name required'),
})

export default function BatchesPage() {
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [sectionOpen, setSectionOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState(null)

  const { data: batches = [], isLoading } = useQuery({
    queryKey: ['prof-batches'],
    queryFn: () => professorAPI.getBatches().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const batchForm = useForm({ resolver: zodResolver(batchSchema) })
  const sectionForm = useForm({ resolver: zodResolver(sectionSchema) })

  const createMutation = useMutation({
    mutationFn: (data) => professorAPI.createBatch(data),
    onSuccess: () => { toast.success('Batch created!'); queryClient.invalidateQueries({ queryKey: ['prof-batches'] }); setCreateOpen(false); batchForm.reset() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const sectionMutation = useMutation({
    mutationFn: ({ id, data }) => professorAPI.createSection(id, data),
    onSuccess: () => { toast.success('Section added!'); queryClient.invalidateQueries({ queryKey: ['prof-batches'] }); setSectionOpen(false); sectionForm.reset() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold font-heading text-dark-900">My Batches</h1><p className="text-dark-500 text-sm mt-1">Manage your teaching batches and sections</p></div>
        <Button icon={Plus} onClick={() => setCreateOpen(true)}>Create Batch</Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : batches.length === 0 ? (
        <EmptyState icon={BookOpen} title="No batches" description="Create your first teaching batch." action={<Button icon={Plus} onClick={() => setCreateOpen(true)}>Create Batch</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch, idx) => (
            <motion.div key={batch.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center"><BookOpen className="w-5 h-5 text-blue-600" /></div>
                  <Badge color="blue" size="sm">Sem {batch.semester}</Badge>
                </div>
                <h3 className="text-lg font-semibold font-heading text-dark-900 mb-1">{batch.name}</h3>
                <p className="text-sm text-dark-500 mb-1">{batch.subject}</p>
                <p className="text-xs text-dark-400 mb-4">Academic Year: {batch.year}</p>

                <div className="flex items-center gap-2 text-sm text-dark-500 mb-4">
                  <Layers className="w-4 h-4 text-dark-400" />
                  {batch.sections?.length || 0} Sections
                </div>

                {batch.sections?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {batch.sections.map((sec) => (
                      <span key={sec.id} className="px-2 py-0.5 rounded-full bg-dark-50 text-dark-600 text-xs font-medium">{sec.name}</span>
                    ))}
                  </div>
                )}

                <Button variant="secondary" size="sm" icon={Plus} className="w-full" onClick={() => { setSelectedBatch(batch); setSectionOpen(true) }}>
                  Add Section
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Batch Modal */}
      <Modal isOpen={createOpen} onClose={() => { setCreateOpen(false); batchForm.reset() }} title="Create Batch" footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={batchForm.handleSubmit((d) => createMutation.mutate(d))} loading={createMutation.isPending}>Create</Button></>}>
        <form className="space-y-4">
          <Input label="Batch Name" placeholder="e.g. CS Batch A" error={batchForm.formState.errors.name?.message} {...batchForm.register('name')} />
          <Input label="Subject" placeholder="e.g. Data Structures" error={batchForm.formState.errors.subject?.message} {...batchForm.register('subject')} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Academic Year</label>
              <select className="input-field" {...batchForm.register('year')}>
                <option value="">Select</option>
                {ACADEMIC_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              {batchForm.formState.errors.year && <p className="mt-1 text-sm text-red-500">{batchForm.formState.errors.year.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Semester</label>
              <select className="input-field" {...batchForm.register('semester')}>
                <option value="">Select</option>
                {SEMESTERS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              {batchForm.formState.errors.semester && <p className="mt-1 text-sm text-red-500">{batchForm.formState.errors.semester.message}</p>}
            </div>
          </div>
        </form>
      </Modal>

      {/* Add Section Modal */}
      <Modal isOpen={sectionOpen} onClose={() => { setSectionOpen(false); sectionForm.reset() }} title={`Add Section — ${selectedBatch?.name || ''}`} size="sm" footer={<><Button variant="secondary" onClick={() => setSectionOpen(false)}>Cancel</Button><Button onClick={sectionForm.handleSubmit((d) => sectionMutation.mutate({ id: selectedBatch?.id, data: d }))} loading={sectionMutation.isPending}>Add</Button></>}>
        <form className="space-y-4">
          <Input label="Section Name" placeholder="e.g. A, B, C" error={sectionForm.formState.errors.name?.message} {...sectionForm.register('name')} />
        </form>
      </Modal>
    </div>
  )
}
