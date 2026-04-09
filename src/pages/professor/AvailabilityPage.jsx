import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Clock, Plus, CheckCircle, X, Calendar as CalendarIcon, Search, Edit2, Trash2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import professorAPI from '../../api/professor.api'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import EmptyState from '../../components/ui/EmptyState'
import { formatTime, formatDate, formatEnumLabel } from '../../utils/formatters'

const slotSchema = z.object({
  date: z.string().min(1, 'Date required'),
  fromTime: z.string().min(1, 'Start time required'),
  toTime: z.string().min(1, 'End time required'),
  status: z.string().min(1, 'Status required'),
  note: z.string().optional(),
}).refine((data) => data.fromTime < data.toTime, {
  message: 'Start time must be before end time',
  path: ['toTime'],
})

const AVAILABILITY_STATUS_COLORS = {
  AVAILABLE: 'green',
  BUSY: 'red',
  ON_LEAVE: 'gray',
}

export default function AvailabilityPage() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSlot, setEditingSlot] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [slotToDelete, setSlotToDelete] = useState(null)

  const { data: slots = [], isLoading } = useQuery({
    queryKey: ['prof-availability'],
    queryFn: () => professorAPI.getAvailability().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const form = useForm({
    resolver: zodResolver(slotSchema),
    defaultValues: {
      status: 'AVAILABLE',
    }
  })

  const createMutation = useMutation({
    mutationFn: (data) => professorAPI.markAvailability(data),
    onSuccess: () => {
      toast.success('Availability slot added!')
      queryClient.invalidateQueries({ queryKey: ['prof-availability'] })
      handleCloseModal()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add slot'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => professorAPI.updateAvailability(id, data),
    onSuccess: () => {
      toast.success('Availability slot updated!')
      queryClient.invalidateQueries({ queryKey: ['prof-availability'] })
      handleCloseModal()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update slot'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => professorAPI.deleteAvailability(id),
    onSuccess: () => {
      toast.success('Availability slot deleted!')
      queryClient.invalidateQueries({ queryKey: ['prof-availability'] })
      setDeleteOpen(false)
      setSlotToDelete(null)
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete slot'),
  })

  const handleEdit = (slot) => {
    setEditingSlot(slot)
    form.reset({
      date: slot.date,
      fromTime: slot.fromTime,
      toTime: slot.toTime,
      status: slot.status,
      note: slot.note || '',
    })
    setModalOpen(true)
  }

  const handleDeleteClick = (slot) => {
    setSlotToDelete(slot)
    setDeleteOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingSlot(null)
    form.reset({
      date: '',
      fromTime: '',
      toTime: '',
      status: 'AVAILABLE',
      note: '',
    })
  }

  const onSubmit = (data) => {
    if (editingSlot) {
      updateMutation.mutate({ id: editingSlot.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  // Group by date
  const slotsByDate = {}
  slots.forEach((s) => {
    if (!slotsByDate[s.date]) slotsByDate[s.date] = []
    slotsByDate[s.date].push(s)
  })

  const datesWithSlots = Object.keys(slotsByDate).sort()

  return (
    <div className="space-y-6 text-dark-900">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-dark-900">My Availability</h1>
          <p className="text-dark-500 text-sm mt-1">Set your available consultation hours for students</p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>Add Slot</Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="h-40 animate-pulse bg-dark-50" />
          ))}
        </div>
      ) : datesWithSlots.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No availability set"
          description="Add consultation hours so students can find you."
          action={<Button icon={Plus} onClick={() => setModalOpen(true)}>Add Slot</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {datesWithSlots.map((dateStr, idx) => (
            <motion.div
              key={dateStr}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold font-heading text-dark-900">{formatDate(dateStr)}</h3>
                </div>
                <div className="space-y-3">
                  {slotsByDate[dateStr]
                    .sort((a, b) => a.fromTime.localeCompare(b.fromTime))
                    .map((slot) => (
                    <div key={slot.id} className="p-3 rounded-xl border border-dark-100 bg-white group relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-dark-400" />
                          <span className="text-sm font-medium text-dark-800">
                            {formatTime(slot.fromTime)} – {formatTime(slot.toTime)}
                          </span>
                        </div>
                        <Badge color={AVAILABILITY_STATUS_COLORS[slot.status] || 'blue'} size="sm">
                          {formatEnumLabel(slot.status)}
                        </Badge>
                      </div>

                      {slot.note && (
                        <p className="text-xs text-dark-500 bg-dark-50 p-2 rounded mb-2 italic">
                          "{slot.note}"
                        </p>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-dark-50">
                        <button
                          onClick={() => handleEdit(slot)}
                          className="p-1.5 rounded-lg text-dark-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(slot)}
                          className="p-1.5 rounded-lg text-dark-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingSlot ? "Edit Availability Slot" : "Add Availability Slot"}
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingSlot ? "Save Changes" : "Add Slot"}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Date"
            type="date"
            error={form.formState.errors.date?.message}
            {...form.register('date')}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="From Time"
              type="time"
              error={form.formState.errors.fromTime?.message}
              {...form.register('fromTime')}
            />
            <Input
              label="To Time"
              type="time"
              error={form.formState.errors.toTime?.message}
              {...form.register('toTime')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Status</label>
            <select className="input-field" {...form.register('status')}>
              <option value="AVAILABLE">Available</option>
              <option value="BUSY">Busy</option>
              <option value="ON_LEAVE">On Leave</option>
            </select>
            {form.formState.errors.status && (
              <p className="mt-1 text-sm text-red-500">{form.formState.errors.status.message}</p>
            )}
          </div>
          <Input
            label="Note (Optional)"
            placeholder="e.g. In Staff Room 2"
            {...form.register('note')}
            error={form.formState.errors.note?.message}
          />
          {form.formState.errors.root && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {form.formState.errors.root.message}
            </p>
          )}
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Availability Slot"
        variant="danger"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => deleteMutation.mutate(slotToDelete.id)}
              loading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </>
        }
      >
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-dark-900 mb-2">Are you sure?</h2>
          <p className="text-dark-500">
            This will permanently remove the availability slot for {slotToDelete && formatDate(slotToDelete.date)} from{' '}
            {slotToDelete && formatTime(slotToDelete.fromTime)} to {slotToDelete && formatTime(slotToDelete.toTime)}.
          </p>
        </div>
      </Modal>
    </div>
  )
}

