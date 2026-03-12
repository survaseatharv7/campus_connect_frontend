import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import studentAPI from '../../api/student.api'
import EventCard from '../../components/shared/EventCard'
import EmptyState from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'

export default function StudentEventsPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState('')

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['student-events'],
    queryFn: () => studentAPI.getEvents().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const { data: myEvents = [] } = useQuery({
    queryKey: ['student-my-events'],
    queryFn: () => studentAPI.getMyEvents().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const registerMutation = useMutation({
    mutationFn: (eventId) => studentAPI.registerForEvent(eventId),
    onSuccess: () => { toast.success('Registered successfully!'); queryClient.invalidateQueries({ queryKey: ['student-my-events'] }) },
    onError: (err) => toast.error(err.response?.data?.message || 'Registration failed'),
  })

  const registeredIds = new Set(myEvents.map((e) => e.id || e.eventId))

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
              isRegistered={registeredIds.has(event.id)}
              onRegister={(e) => registerMutation.mutate(e.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
