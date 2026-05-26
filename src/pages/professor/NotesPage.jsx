import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FileText, Plus, Trash2, Edit, Download, BookOpen, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import professorAPI from '../../api/professor.api'
import { uploadNotes } from '../../api/upload.api'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import FileUpload from '../../components/ui/FileUpload'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { formatDate, fixCloudinaryUrl } from '../../utils/formatters'
import { YEAR_LABELS } from '../../utils/constants'

const noteSchema = z.object({
  title: z.string().min(2, 'Title required'),
  subject: z.string().min(2, 'Subject required'),
  year: z.preprocess((val) => (val ? Number(val) : undefined), z.number({ required_error: 'Year is required' }).min(1).max(4)),
  semester: z.preprocess((val) => (val ? Number(val) : undefined), z.number({ required_error: 'Semester is required' }).min(1).max(8)),
  division: z.string().nullable().optional().transform(v => v === '' ? null : v),
  fileUrl: z.string().min(1, 'File is required'),
  description: z.string().optional(),
})

export default function NotesPage() {
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['prof-notes'],
    queryFn: () => professorAPI.getNotes().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const form = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      subject: '',
      year: '',
      semester: '',
      division: '',
      fileUrl: '',
      description: '',
    }
  })

  const selectedYear = form.watch('year')

  useEffect(() => {
    form.setValue('semester', '')
  }, [selectedYear, form])

  const getSemesterOptions = (yr) => {
    const yNum = Number(yr);
    if (yNum === 1) return [{ value: 1, label: "Semester 1" }, { value: 2, label: "Semester 2" }];
    if (yNum === 2) return [{ value: 3, label: "Semester 3" }, { value: 4, label: "Semester 4" }];
    if (yNum === 3) return [{ value: 5, label: "Semester 5" }, { value: 6, label: "Semester 6" }];
    if (yNum === 4) return [{ value: 7, label: "Semester 7" }, { value: 8, label: "Semester 8" }];
    return [];
  }

  const createMutation = useMutation({
    mutationFn: (data) => professorAPI.uploadNote(data),
    onSuccess: () => { toast.success('Note uploaded!'); queryClient.invalidateQueries({ queryKey: ['prof-notes'] }); setCreateOpen(false); form.reset() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => professorAPI.deleteNote(id),
    onSuccess: () => { toast.success('Note deleted'); queryClient.invalidateQueries({ queryKey: ['prof-notes'] }) },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold font-heading text-dark-900">My Notes</h1><p className="text-dark-500 text-sm mt-1">Upload and manage study materials</p></div>
        <Button icon={Plus} onClick={() => setCreateOpen(true)}>Upload Note</Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : notes.length === 0 ? (
        <EmptyState icon={FileText} title="No notes" description="Upload your first study material." action={<Button icon={Plus} onClick={() => setCreateOpen(true)}>Upload Note</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, idx) => (
            <motion.div key={note.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card className="group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center"><FileText className="w-5 h-5 text-emerald-600" /></div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => deleteMutation.mutate(note.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold font-heading text-dark-900 mb-1">{note.title}</h3>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge color="blue" size="sm">{note.subject}</Badge>
                  {note.year && (
                    <Badge color={note.year === 1 ? 'blue' : note.year === 2 ? 'green' : note.year === 3 ? 'orange' : 'purple'} size="sm">
                      {`[${YEAR_LABELS[note.year] || note.year}] · Sem ${note.semester} · ${note.division || 'All Divisions'}`}
                    </Badge>
                  )}
                </div>
                {note.description && <p className="text-sm text-dark-500 mb-3 line-clamp-2">{note.description}</p>}
                <div className="text-xs text-dark-400 mb-3 flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(note.uploadedAt)}</div>
                {note.fileUrl && (
                  <a href={fixCloudinaryUrl(note.fileUrl)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium">
                    <Download className="w-4 h-4" /> Download
                  </a>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={createOpen} onClose={() => { setCreateOpen(false); form.reset() }} title="Upload Study Note" footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={form.handleSubmit((d) => createMutation.mutate(d))} loading={createMutation.isPending}>Upload</Button></>}>
        <div className="space-y-4">
          <Input label="Title" placeholder="e.g. Linked List Notes" error={form.formState.errors.title?.message} {...form.register('title')} />
          <Input label="Subject" placeholder="e.g. Data Structures" error={form.formState.errors.subject?.message} {...form.register('subject')} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Year</label>
              <select className="input-field" {...form.register('year')}>
                <option value="">Select Year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
              {form.formState.errors.year && <p className="mt-1.5 text-sm text-red-500">{form.formState.errors.year.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Semester</label>
              <select className="input-field" {...form.register('semester')} disabled={!selectedYear}>
                <option value="">Select Semester</option>
                {getSemesterOptions(selectedYear).map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              {form.formState.errors.semester && <p className="mt-1.5 text-sm text-red-500">{form.formState.errors.semester.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Division (Optional)</label>
            <select className="input-field" {...form.register('division')}>
              <option value="">All Divisions</option>
              <option value="A">Division A</option>
              <option value="B">Division B</option>
              <option value="C">Division C</option>
              <option value="D">Division D</option>
            </select>
            <p className="text-xs text-dark-400 mt-1">Leave empty to show notes to all divisions</p>
          </div>
          <FileUpload
            label="Upload File"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            uploadFn={uploadNotes}
            onUpload={(url) => form.setValue('fileUrl', url, { shouldValidate: true, shouldDirty: true })}
            value={form.watch('fileUrl')}
            maxSizeMB={20}
            error={form.formState.errors.fileUrl?.message}
          />
          <div><label className="block text-sm font-medium text-dark-700 mb-1.5">Description (Optional)</label><textarea className="input-field min-h-[80px] resize-y" placeholder="Brief description..." {...form.register('description')} /></div>
        </div>
      </Modal>
    </div>
  )
}
