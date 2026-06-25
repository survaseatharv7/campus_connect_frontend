import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import studentAPI from '../../api/student.api'
import EventCard from '../../components/shared/EventCard'
import EventManagementModal from '../../components/shared/EventManagementModal'
import EmptyState from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'

export default function StudentEventsPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [manageEvent, setManageEvent] = useState(null)

  const { data: eventsResponse, isLoading } = useQuery({
    queryKey: ['student-events'],
    queryFn: studentAPI.getEvents,
    // Refresh every 60s so status (UPCOMING/ONGOING/COMPLETED) is always current
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
  })
  const events = Array.isArray(eventsResponse?.data?.data) ? eventsResponse.data.data : Array.isArray(eventsResponse?.data) ? eventsResponse.data : []

  const { data: registrationsResponse } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: studentAPI.getMyRegistrations,
  })
  const registrations = Array.isArray(registrationsResponse?.data?.data) ? registrationsResponse.data.data : Array.isArray(registrationsResponse?.data) ? registrationsResponse.data : []

  const registerMutation = useMutation({
    mutationFn: (eventId) => studentAPI.registerForEvent(eventId),
    onMutate: async (eventId) => {
      await queryClient.cancelQueries({ queryKey: ['student-events'] })
      const previousEvents = queryClient.getQueryData(['student-events'])
      
      queryClient.setQueryData(['student-events'], (old) => {
        const dataPath = Array.isArray(old?.data?.data) ? ['data', 'data'] : Array.isArray(old?.data) ? ['data'] : [];
        if (dataPath.length === 0) return old;
        
        const newEventsResponse = { ...old };
        let current = newEventsResponse;
        for (let i = 0; i < dataPath.length - 1; i++) {
          current[dataPath[i]] = { ...current[dataPath[i]] };
          current = current[dataPath[i]];
        }
        
        const lastKey = dataPath[dataPath.length - 1];
        current[lastKey] = current[lastKey].map(event =>
          event.id === eventId ? { ...event, isRegistered: true, registeredCount: (event.registeredCount || 0) + 1 } : event
        );
        
        return newEventsResponse;
      })

      return { previousEvents }
    },
    onError: (err, eventId, context) => {
      queryClient.setQueryData(['student-events'], context.previousEvents)
      toast.error(err.response?.data?.message || 'Registration failed')
    },
    onSuccess: () => {
      toast.success('Registered successfully!')
      queryClient.invalidateQueries({ queryKey: ['student-events'] })
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] })
    },
  })

  const filtered = events.filter((e) => {
    const matchesSearch = e.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = !levelFilter || e.eventLevel === levelFilter
    return matchesSearch && matchesLevel
  })

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-heading text-dark-900">Events</h1><p className="text-dark-500 text-sm mt-1">Browse and register for campus events</p></div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-10" />
        </div>
        <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="input-field w-auto min-w-[150px]">
          <option value="">All Levels</option>
          <option value="CAMPUS">Campus</option>
          <option value="COLLEGE">College</option>
          <option value="DEPARTMENT">Department</option>
          <option value="CLUB">Club</option>
        </select>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Calendar} title="No events found" description={searchTerm ? 'Try different search terms.' : 'No events available right now.'} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event, idx) => (
            <EventCard
              key={event.id}
              event={event}
              delay={idx * 0.05}
              showRegister
              isRegistered={event.isRegistered || !!registrations.find(r => r.eventId === event.id)}
              isRegistering={registerMutation.isPending && registerMutation.variables === event.id}
              onRegister={(e) => registerMutation.mutate(e.id)}
              onView={(e) => setManageEvent(e)}
              // Students never own events — no delete
              isOwner={false}
            />
          ))}
        </div>
      )}

      <EventManagementModal
        isOpen={!!manageEvent}
        onClose={() => setManageEvent(null)}
        event={manageEvent}
        isCreator={false}
        fetchParticipants={studentAPI.getEventParticipants}
        updateStatus={studentAPI.updateEventStatus}
        studentRegistrations={registrations}
      />
    </div>
  )
}
