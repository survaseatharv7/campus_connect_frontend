import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Clock, Plus, CheckCircle, X } from 'lucide-react'
import toast from 'react-hot-toast'
import professorAPI from '../../api/professor.api'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import EmptyState from '../../components/ui/EmptyState'
import { DAYS_OF_WEEK } from '../../utils/constants'
import { formatTime } from '../../utils/formatters'

const slotSchema = z.object({
  dayOfWeek: z.string().min(1, 'Day required'),
  fromTime: z.string().min(1, 'Start time required'),
  toTime: z.string().min(1, 'End time required'),
  location: z.string().optional(),
})

export default function AvailabilityPage() {
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)

  const { data: slots = [], isLoading } = useQuery({
    queryKey: ['prof-availability'],
    queryFn: () => professorAPI.getAvailability().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const form = useForm({ resolver: zodResolver(slotSchema) })

  const createMutation = useMutation({
    mutationFn: (data) => professorAPI.markAvailability(data),
    onSuccess: () => { toast.success('Availability slot added!'); queryClient.invalidateQueries({ queryKey: ['prof-availability'] }); setCreateOpen(false); form.reset() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  // Group by day
  const slotsByDay = {}
  DAYS_OF_WEEK.forEach((day) => {
    slotsByDay[day] = slots.filter((s) => s.dayOfWeek === day).sort((a, b) => (a.fromTime || '').localeCompare(b.fromTime || ''))
  })

  const daysWithSlots = DAYS_OF_WEEK.filter((d) => slotsByDay[d].length > 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold font-heading text-dark-900">My Availability</h1><p className="text-dark-500 text-sm mt-1">Set your available consultation hours for students</p></div>
        <Button icon={Plus} onClick={() => setCreateOpen(true)}>Add Slot</Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 3 }).map((_, i) => <Card key={i} className="h-40 animate-pulse bg-dark-50" />)}</div>
      ) : daysWithSlots.length === 0 ? (
        <EmptyState icon={Clock} title="No availability set" description="Add consultation hours so students can find you." action={<Button icon={Plus} onClick={() => setCreateOpen(true)}>Add Slot</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {daysWithSlots.map((day, idx) => (
            <motion.div key={day} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center"><Clock className="w-5 h-5 text-orange-600" /></div>
                  <h3 className="text-lg font-semibold font-heading text-dark-900">{day}</h3>
                </div>
                <div className="space-y-2">
                  {slotsByDay[day].map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-100">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {formatTime(slot.fromTime)} – {formatTime(slot.toTime)}
                        </span>
                      </div>
                      {slot.location && <span className="text-xs text-green-600">{slot.location}</span>}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Weekly Summary */}
      <Card hover={false}>
        <h3 className="text-lg font-semibold font-heading text-dark-900 mb-4">Weekly Overview</h3>
        <div className="grid grid-cols-6 gap-2">
          {DAYS_OF_WEEK.map((day) => {
            const count = slotsByDay[day]?.length || 0
            return (
              <div key={day} className={`text-center p-3 rounded-xl ${count > 0 ? 'bg-green-50 border border-green-100' : 'bg-dark-50 border border-dark-100'}`}>
                <p className="text-xs font-medium text-dark-600 mb-1">{day.slice(0, 3)}</p>
                <p className={`text-lg font-bold ${count > 0 ? 'text-green-600' : 'text-dark-300'}`}>{count}</p>
                <p className="text-xs text-dark-400">slots</p>
              </div>
            )
          })}
        </div>
      </Card>

      <Modal isOpen={createOpen} onClose={() => { setCreateOpen(false); form.reset() }} title="Add Availability Slot" footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={form.handleSubmit((d) => createMutation.mutate(d))} loading={createMutation.isPending}>Add</Button></>}>
        <form className="space-y-4">
          <div><label className="block text-sm font-medium text-dark-700 mb-1.5">Day</label><select className="input-field" {...form.register('dayOfWeek')}><option value="">Select day</option>{DAYS_OF_WEEK.map((d) => <option key={d} value={d}>{d}</option>)}</select>{form.formState.errors.dayOfWeek && <p className="mt-1 text-sm text-red-500">{form.formState.errors.dayOfWeek.message}</p>}</div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="From" type="time" error={form.formState.errors.fromTime?.message} {...form.register('fromTime')} />
            <Input label="To" type="time" error={form.formState.errors.toTime?.message} {...form.register('toTime')} />
          </div>
          <Input label="Location (Optional)" placeholder="e.g. Staff Room 2" {...form.register('location')} />
        </form>
      </Modal>
    </div>
  )
}
