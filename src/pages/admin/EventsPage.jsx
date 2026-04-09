import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import adminAPI from '../../api/admin.api'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import EmptyState from '../../components/ui/EmptyState'
import EventCard from '../../components/shared/EventCard'
import EventManagementModal from '../../components/shared/EventManagementModal'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { EVENT_TYPE } from '../../constants/enums'

const eventSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  eventDate: z.string().min(1, 'Date is required'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  venue: z.string().min(2, 'Venue is required'),
  maxParticipants: z.string().optional(),
  ticketPrice: z.string().optional(),
  posterUrl: z.string().optional(),
})

export default function AdminEventsPage() {
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [manageEvent, setManageEvent] = useState(null)

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: () => adminAPI.getEvents().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const form = useForm({ resolver: zodResolver(eventSchema) })

  const createMutation = useMutation({
    mutationFn: (data) => {
      const startDateTime = new Date(`${data.eventDate}T${data.startTime || '09:00'}`).toISOString()
      const endDateTime = new Date(`${data.eventDate}T${data.endTime || '17:00'}`).toISOString()
      
      return adminAPI.createEvent({
        title: data.title,
        description: data.description,
        venue: data.venue,
        posterUrl: data.posterUrl,
        startDateTime,
        endDateTime,
        maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants) : null,
        ticketPrice: data.ticketPrice ? parseFloat(data.ticketPrice) : 0,
        eventLevel: 'CAMPUS',
        eventType: EVENT_TYPE.MAIN,
      })
    },
    onSuccess: () => {
      toast.success('Campus event created!')
      queryClient.invalidateQueries({ queryKey: ['admin-events'] })
      setCreateOpen(false)
      form.reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create event'),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-dark-900">Campus Events</h1>
          <p className="text-dark-500 text-sm mt-1">Manage campus-wide events</p>
        </div>
        <Button icon={Plus} onClick={() => setCreateOpen(true)}>
          Create Event
        </Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No campus events"
          description="Create your first campus-wide event."
          action={
            <Button icon={Plus} onClick={() => setCreateOpen(true)}>
              Create Event
            </Button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, idx) => (
            <EventCard key={event.id} event={event} delay={idx * 0.05} onView={(e) => setManageEvent(e)} />
          ))}
        </div>
      )}

      <Modal
        isOpen={createOpen}
        onClose={() => {
          setCreateOpen(false)
          form.reset()
        }}
        title="Create Campus Event"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit((data) => createMutation.mutate(data))}
              loading={createMutation.isPending}
            >
              Create Event
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Event Title"
            placeholder="e.g. Annual Tech Fest 2026"
            error={form.formState.errors.title?.message}
            {...form.register('title')}
          />
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Description</label>
            <textarea
              className="input-field min-h-[100px] resize-y"
              placeholder="Describe the event..."
              {...form.register('description')}
            />
            {form.formState.errors.description?.message && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Event Date"
              type="date"
              error={form.formState.errors.eventDate?.message}
              {...form.register('eventDate')}
            />
            <Input label="Start Time" type="time" {...form.register('startTime')} />
            <Input label="End Time" type="time" {...form.register('endTime')} />
          </div>
          <Input
            label="Venue"
            placeholder="e.g. Main Auditorium"
            error={form.formState.errors.venue?.message}
            {...form.register('venue')}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Max Participants"
              type="number"
              placeholder="Leave blank for unlimited"
              {...form.register('maxParticipants')}
            />
            <Input
              label="Ticket Price (₹)"
              type="number"
              placeholder="0 for free"
              {...form.register('ticketPrice')}
            />
          </div>
          <Input
            label="Poster URL (Optional)"
            placeholder="https://..."
            {...form.register('posterUrl')}
          />
        </form>
      </Modal>

      <EventManagementModal
        isOpen={!!manageEvent}
        onClose={() => setManageEvent(null)}
        event={manageEvent}
        isCreator={true}
        fetchParticipants={adminAPI.getEventParticipants}
        updateStatus={adminAPI.updateEventStatus}
      />
    </div>
  )
}
