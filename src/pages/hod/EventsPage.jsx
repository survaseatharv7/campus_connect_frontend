import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import hodAPI from '../../api/hod.api'
import { uploadEventImage } from '../../api/upload.api'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import EmptyState from '../../components/ui/EmptyState'
import FileUpload from '../../components/ui/FileUpload'
import EventCard from '../../components/shared/EventCard'
import EventManagementModal from '../../components/shared/EventManagementModal'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { EVENT_TYPE } from '../../constants/enums'
import useAuthStore from '../../store/authStore'

const eventSchema = z.object({
  title: z.string().min(2, 'Title required'),
  description: z.string().min(10, 'Description must be 10+ chars'),
  eventDate: z.string().min(1, 'Date required'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  venue: z.string().min(2, 'Venue required'),
  maxParticipants: z.string().optional(),
  ticketPrice: z.string().optional(),
  posterUrl: z.string().optional(),
  openToExternal: z.boolean().default(false),
})

export default function HODEventsPage() {
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [manageEvent, setManageEvent] = useState(null)
  const { user } = useAuthStore()

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['hod-events'],
    queryFn: () => hodAPI.getEvents().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
  })

  const form = useForm({ resolver: zodResolver(eventSchema) })

  const createMutation = useMutation({
    mutationFn: (data) => {
      const startDateTime = new Date(`${data.eventDate}T${data.startTime || '09:00'}`).toISOString()
      const endDateTime = new Date(`${data.eventDate}T${data.endTime || '17:00'}`).toISOString()
      
      return hodAPI.createEvent({
        title: data.title,
        description: data.description,
        venue: data.venue,
        posterUrl: data.posterUrl,
        startDateTime,
        endDateTime,
        maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants) : null,
        ticketPrice: data.ticketPrice ? parseFloat(data.ticketPrice) : 0,
        eventLevel: 'DEPARTMENT',
        eventType: EVENT_TYPE.MAIN,
        openToExternal: data.openToExternal,
      })
    },
    onSuccess: () => { toast.success('Department event created!'); queryClient.invalidateQueries({ queryKey: ['hod-events'] }); setCreateOpen(false); form.reset() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const approveMutation = useMutation({
    mutationFn: (id) => hodAPI.approveEvent(id),
    onSuccess: () => { toast.success('Event approved!'); queryClient.invalidateQueries({ queryKey: ['hod-events'] }) },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to approve'),
  })

  const deleteMutation = useMutation({
    mutationFn: (eventId) => hodAPI.deleteEvent(eventId),
    onSuccess: (_, eventId) => {
      toast.success('Event deleted successfully')
      queryClient.setQueryData(['hod-events'], (old) =>
        Array.isArray(old) ? old.filter((e) => e.id !== eventId) : old
      )
      queryClient.invalidateQueries({ queryKey: ['hod-events'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete event'),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold font-heading text-dark-900">Department Events</h1><p className="text-dark-500 text-sm mt-1">Manage department-level events</p></div>
        <Button icon={Plus} onClick={() => setCreateOpen(true)}>Create Event</Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : events.length === 0 ? (
        <EmptyState icon={Calendar} title="No events" description="Create your first department event." action={<Button icon={Plus} onClick={() => setCreateOpen(true)}>Create Event</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, idx) => (
            <EventCard
              key={event.id}
              event={event}
              delay={idx * 0.05}
              showApprove
              onApprove={(e) => approveMutation.mutate(e.id)}
              onView={(e) => setManageEvent(e)}
              isOwner={user?.name === event.createdByName}
              onDelete={(e) => deleteMutation.mutate(e.id)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={createOpen} onClose={() => { setCreateOpen(false); form.reset() }} title="Create Department Event" size="lg" footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={form.handleSubmit((d) => createMutation.mutate(d))} loading={createMutation.isPending}>Create Event</Button></>}>
        <form className="space-y-4">
          <Input label="Event Title" placeholder="e.g. Department Hackathon" error={form.formState.errors.title?.message} {...form.register('title')} />
          <div><label className="block text-sm font-medium text-dark-700 mb-1.5">Description</label><textarea className="input-field min-h-[100px] resize-y" placeholder="Describe the event..." {...form.register('description')} />{form.formState.errors.description?.message && <p className="mt-1 text-sm text-red-500">{form.formState.errors.description.message}</p>}</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Date" type="date" error={form.formState.errors.eventDate?.message} {...form.register('eventDate')} />
            <Input label="Start" type="time" {...form.register('startTime')} />
            <Input label="End" type="time" {...form.register('endTime')} />
          </div>
          <Input label="Venue" placeholder="CS Lab" error={form.formState.errors.venue?.message} {...form.register('venue')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Max Participants" type="number" placeholder="∞" {...form.register('maxParticipants')} />
            <Input label="Ticket Price (₹)" type="number" placeholder="0" {...form.register('ticketPrice')} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="openToExternal" {...form.register('openToExternal')} className="w-4 h-4 accent-indigo-600" />
            <label htmlFor="openToExternal" className="text-sm font-medium text-gray-700">
              Open to External Students
            </label>
          </div>
          <FileUpload
            label="Event Poster (Optional)"
            accept="image/*"
            uploadFn={uploadEventImage}
            onUpload={(url) => form.setValue('posterUrl', url, { shouldDirty: true })}
            value={form.watch('posterUrl')}
            maxSizeMB={5}
          />
        </form>
      </Modal>

      <EventManagementModal
        isOpen={!!manageEvent}
        onClose={() => setManageEvent(null)}
        event={manageEvent}
        isCreator={user?.name === manageEvent?.createdByName}
        fetchParticipants={hodAPI.getEventParticipants}
        updateStatus={hodAPI.updateEventStatus}
      />
    </div>
  )
}
