import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Clock, Plus, Trash2, Edit, X } from 'lucide-react'
import toast from 'react-hot-toast'
import hodAPI from '../../api/hod.api'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import EmptyState from '../../components/ui/EmptyState'
import { DAYS_OF_WEEK } from '../../utils/constants'
import { formatTime } from '../../utils/formatters'

const slotSchema = z.object({
  batchId: z.string().min(1, 'Batch ID is required'),
  dayOfWeek: z.string().min(1, 'Day is required'),
  fromTime: z.string().min(1, 'Start time is required'),
  toTime: z.string().min(1, 'End time is required'),
  subject: z.string().min(1, 'Subject is required'),
  teacherId: z.string().min(1, 'Teacher ID is required'),
  room: z.string().min(1, 'Room is required'),
})

const subjectColors = [
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-teal-100 text-teal-700 border-teal-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
]

function getSubjectColor(subject, subjects) {
  const idx = subjects.indexOf(subject)
  return subjectColors[idx % subjectColors.length]
}

export default function TimetablePage() {
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [editSlot, setEditSlot] = useState(null)
  const [activeDay, setActiveDay] = useState(DAYS_OF_WEEK[0])

  const { data: timetable = [], isLoading } = useQuery({
    queryKey: ['hod-timetable'],
    queryFn: () => hodAPI.getTimetable().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const form = useForm({ resolver: zodResolver(slotSchema) })

  const createMutation = useMutation({
    mutationFn: (data) => hodAPI.createTimetable(data),
    onSuccess: () => { toast.success('Slot added!'); queryClient.invalidateQueries({ queryKey: ['hod-timetable'] }); setCreateOpen(false); form.reset() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => hodAPI.updateTimetable(id, data),
    onSuccess: () => { toast.success('Slot updated!'); queryClient.invalidateQueries({ queryKey: ['hod-timetable'] }); setEditSlot(null); form.reset() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => hodAPI.deleteTimetable(id),
    onSuccess: () => { toast.success('Slot deleted'); queryClient.invalidateQueries({ queryKey: ['hod-timetable'] }) },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const uniqueSubjects = [...new Set(timetable.map((t) => t.subject).filter(Boolean))]

  // Group by day
  const slotsByDay = {}
  DAYS_OF_WEEK.forEach((day) => {
    slotsByDay[day] = timetable
      .filter((t) => t.dayOfWeek === day)
      .sort((a, b) => (a.fromTime || '').localeCompare(b.fromTime || ''))
  })

  const openEdit = (slot) => {
    setEditSlot(slot)
    form.reset({
      batchId: slot.batchId || '',
      dayOfWeek: slot.dayOfWeek,
      fromTime: slot.fromTime,
      toTime: slot.toTime,
      subject: slot.subject,
      teacherId: slot.teacherId || '',
      room: slot.room,
    })
  }

  const formModal = (
    <form className="space-y-4">
      <Input label="Batch ID" placeholder="Enter Batch UUID" error={form.formState.errors.batchId?.message} {...form.register('batchId')} />
      <div>
        <label className="block text-sm font-medium text-dark-700 mb-1.5">Day of Week</label>
        <select className="input-field" {...form.register('dayOfWeek')}>
          <option value="">Select day</option>
          {DAYS_OF_WEEK.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        {form.formState.errors.dayOfWeek && <p className="mt-1 text-sm text-red-500">{form.formState.errors.dayOfWeek.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="From Time" type="time" error={form.formState.errors.fromTime?.message} {...form.register('fromTime')} />
        <Input label="To Time" type="time" error={form.formState.errors.toTime?.message} {...form.register('toTime')} />
      </div>
      <Input label="Subject" placeholder="e.g. Data Structures" error={form.formState.errors.subject?.message} {...form.register('subject')} />
      <Input label="Teacher ID" placeholder="Enter Teacher UUID" error={form.formState.errors.teacherId?.message} {...form.register('teacherId')} />
      <Input label="Room" placeholder="e.g. Room 301" error={form.formState.errors.room?.message} {...form.register('room')} />
    </form>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-dark-900">Department Timetable</h1>
          <p className="text-dark-500 text-sm mt-1">Manage weekly class schedule</p>
        </div>
        <Button icon={Plus} onClick={() => { form.reset(); setCreateOpen(true) }}>Add Slot</Button>
      </div>

      {/* Day Tabs — mobile view */}
      <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
        {DAYS_OF_WEEK.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeDay === day ? 'bg-primary-600 text-white' : 'bg-white text-dark-500 border border-dark-200'
            }`}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Desktop: Weekly Grid */}
      <div className="hidden lg:block">
        {timetable.length === 0 && !isLoading ? (
          <EmptyState icon={Clock} title="No timetable entries" description="Add class slots to build your department timetable." action={<Button icon={Plus} onClick={() => setCreateOpen(true)}>Add Slot</Button>} />
        ) : (
          <div className="grid grid-cols-6 gap-4">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day}>
                <div className="text-center mb-3">
                  <span className={`text-sm font-semibold ${
                    day === DAYS_OF_WEEK[new Date().getDay() - 1] ? 'text-primary-600' : 'text-dark-700'
                  }`}>
                    {day}
                  </span>
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {slotsByDay[day]?.map((slot, idx) => (
                    <motion.div
                      key={slot.id || idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-3 rounded-xl border ${getSubjectColor(slot.subject, uniqueSubjects)} group relative cursor-pointer`}
                      onClick={() => openEdit(slot)}
                    >
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button onClick={(e) => { e.stopPropagation(); openEdit(slot) }} className="p-1 rounded bg-white/80 hover:bg-white"><Edit className="w-3 h-3" /></button>
                        <button onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(slot.id) }} className="p-1 rounded bg-white/80 hover:bg-red-50 text-red-500"><Trash2 className="w-3 h-3" /></button>
                      </div>
                      <p className="text-xs font-mono opacity-70 mb-1">
                        {formatTime(slot.fromTime)} – {formatTime(slot.toTime)}
                      </p>
                      <p className="text-sm font-semibold leading-tight">{slot.subject}</p>
                      <p className="text-xs opacity-70 mt-1">{slot.teacherName}</p>
                      <p className="text-xs opacity-60">{slot.room}</p>
                    </motion.div>
                  ))}
                  {(!slotsByDay[day] || slotsByDay[day].length === 0) && (
                    <div className="text-xs text-dark-300 text-center py-8">No classes</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile: Day List */}
      <div className="lg:hidden">
        <div className="space-y-3">
          {(slotsByDay[activeDay] || []).length === 0 ? (
            <Card hover={false} className="text-center py-8 text-dark-400 text-sm">No classes on {activeDay}</Card>
          ) : (
            (slotsByDay[activeDay] || []).map((slot, idx) => (
              <motion.div
                key={slot.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="flex items-center gap-4">
                  <div className="text-center min-w-[70px]">
                    <p className="text-xs font-mono text-dark-500">{formatTime(slot.fromTime)}</p>
                    <p className="text-xs text-dark-300">to</p>
                    <p className="text-xs font-mono text-dark-500">{formatTime(slot.toTime)}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-dark-900">{slot.subject}</p>
                    <p className="text-sm text-dark-500">{slot.teacherName} • {slot.room}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(slot)} className="p-2 rounded-lg hover:bg-dark-50"><Edit className="w-4 h-4 text-dark-400" /></button>
                    <button onClick={() => deleteMutation.mutate(slot.id)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-400" /></button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal isOpen={createOpen} onClose={() => { setCreateOpen(false); form.reset() }} title="Add Timetable Slot" footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={form.handleSubmit((d) => createMutation.mutate(d))} loading={createMutation.isPending}>Add Slot</Button></>}>
        {formModal}
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editSlot} onClose={() => { setEditSlot(null); form.reset() }} title="Edit Timetable Slot" footer={<><Button variant="secondary" onClick={() => setEditSlot(null)}>Cancel</Button><Button onClick={form.handleSubmit((d) => updateMutation.mutate({ id: editSlot?.id, data: d }))} loading={updateMutation.isPending}>Update</Button></>}>
        {formModal}
      </Modal>
    </div>
  )
}
