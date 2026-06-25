import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { 
  Clock, 
  Search, 
  Calendar as CalendarIcon, 
  User, 
  MessageSquare,
  AlertCircle,
  LayoutGrid,
  List,
  Info
} from 'lucide-react'
import studentAPI from '../../api/student.api'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import { formatTime, formatDate, formatEnumLabel } from '../../utils/formatters'
import { AVAILABILITY_STATUS_COLORS } from '../../utils/constants'

export default function TeacherAvailabilityPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // ALL, AVAILABLE
  const [viewType, setViewType] = useState('list') // calendar, list
  const [selectedEvent, setSelectedEvent] = useState(null)

  const { data: availability = [], isLoading, error } = useQuery({
    queryKey: ['teacherAvailability'],
    queryFn: async () => {
      const response = await studentAPI.getTeacherAvailability()
      return response.data.data || []
    }
  })

  const filteredAvailability = useMemo(() => {
    return availability.filter(item => {
      const matchesSearch = item.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'ALL' || item.status === 'AVAILABLE'
      return matchesSearch && matchesStatus
    })
  }, [availability, searchTerm, statusFilter])

  // Map data for FullCalendar
  const calendarEvents = useMemo(() => {
    return filteredAvailability.map(slot => ({
      id: slot.id,
      title: slot.teacherName,
      start: `${slot.date}T${slot.fromTime}`,
      end: `${slot.date}T${slot.toTime}`,
      extendedProps: {
        note: slot.note,
        status: slot.status,
      },
      backgroundColor: slot.status === 'AVAILABLE' ? '#16a34a' : slot.status === 'BUSY' ? '#dc2626' : '#4b5563',
      borderColor: 'transparent',
      textColor: '#ffffff'
    }))
  }, [filteredAvailability])

  const groupedAvailability = useMemo(() => {
    const groups = {}
    filteredAvailability.forEach(item => {
      if (!groups[item.date]) groups[item.date] = []
      groups[item.date].push(item)
    })
    return Object.keys(groups).sort().map(date => ({
      date,
      slots: groups[date].sort((a, b) => a.fromTime.localeCompare(b.fromTime))
    }))
  }, [filteredAvailability])

  const handleEventClick = (info) => {
    const slot = availability.find(s => s.id === info.event.id)
    if (slot) setSelectedEvent(slot)
  }

  if (error) {
    return (
      <EmptyState 
        icon={AlertCircle}
        title="Error loading availability"
        description="We couldn't fetch the teacher availability list. Please try again later."
      />
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-heading text-dark-900 tracking-tight">
            Teacher <span className="text-primary-600">Availability</span>
          </h1>
          <p className="text-dark-500 mt-2 max-w-lg">
            Consult the interactive calendar to find and connect with professors during their office hours.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Filter by teacher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-dark-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all shadow-sm"
            />
          </div>

          <div className="flex bg-white p-1 rounded-2xl border border-dark-200 shadow-sm shrink-0">
            <button
              onClick={() => setViewType('calendar')}
              className={`p-2 rounded-xl transition-all ${
                viewType === 'calendar' ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'text-dark-400 hover:text-dark-600'
              }`}
              title="Calendar View"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewType('list')}
              className={`p-2 rounded-xl transition-all ${
                viewType === 'list' ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'text-dark-400 hover:text-dark-600'
              }`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          <div className="flex bg-white p-1 rounded-2xl border border-dark-200 shadow-sm shrink-0">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                statusFilter === 'ALL' ? 'bg-dark-900 text-white shadow-lg shadow-dark-200' : 'text-dark-500 hover:text-dark-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('AVAILABLE')}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                statusFilter === 'AVAILABLE' ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'text-dark-500 hover:text-dark-700'
              }`}
            >
              Available
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="min-h-[600px] flex items-center justify-center bg-white border border-dark-100 rounded-3xl">
          <div className="text-center space-y-4">
            <Spinner size="lg" className="mx-auto" />
            <p className="text-dark-500 font-medium">Preparing your schedule...</p>
          </div>
        </div>
      ) : viewType === 'calendar' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-dark-100 rounded-3xl p-6 shadow-xl shadow-dark-200/20 overflow-hidden"
        >
          <style>{`
            .fc { font-family: inherit; --fc-border-color: #f1f5f9; --fc-daygrid-event-dot-width: 8px; }
            .fc .fc-toolbar-title { font-size: 1.25rem; font-weight: 700; color: #0f172a; }
            .fc .fc-button-primary { background-color: #ffffff; border-color: #e2e8f0; color: #475569; font-weight: 600; padding: 0.5rem 1rem; border-radius: 0.75rem; transition: all 0.2s; text-transform: capitalize; }
            .fc .fc-button-primary:hover { background-color: #f8fafc; border-color: #cbd5e1; color: #1e293b; }
            .fc .fc-button-primary:not(:disabled).fc-button-active { background-color: #2563eb; border-color: #2563eb; color: #ffffff; }
            .fc .fc-col-header-cell { padding: 12px 0; background-color: #f8fafc; font-weight: 600; color: #64748b; font-size: 0.875rem; }
            .fc .fc-event { border-radius: 6px; padding: 2px 4px; font-size: 0.75rem; font-weight: 600; border: none !important; cursor: pointer; transition: transform 0.1s; }
            .fc .fc-event:hover { transform: scale(1.02); }
            .fc .fc-daygrid-day-number { padding: 10px; font-weight: 500; color: #334155; }
            .fc .fc-day-today { background-color: #eff6ff !important; }
          `}</style>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={calendarEvents}
            eventClick={handleEventClick}
            height="auto"
            allDaySlot={false}
            slotMinTime="08:00:00"
            slotMaxTime="19:00:00"
            expandRows={true}
            nowIndicator={true}
            dayMaxEvents={true}
          />
        </motion.div>
      ) : (
        <div className="space-y-10">
          {groupedAvailability.length === 0 ? (
            <EmptyState 
              icon={Clock}
              title="No availability found"
              description="Adjust your search or filters to see more results."
            />
          ) : (
            groupedAvailability.map((group, groupIdx) => (
              <div key={group.date} className="space-y-6">
                <div className="flex items-center gap-3 underline-offset-4 decoration-primary-500/30">
                  <div className="px-5 py-2 bg-primary-50 border border-primary-100 rounded-2xl flex items-center gap-2.5">
                    <CalendarIcon className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-bold text-primary-900 tracking-wide uppercase">
                      {formatDate(group.date)}
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-dark-100 to-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.slots.map((slot, idx) => (
                    <motion.div
                      key={slot.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="group hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 border-dark-100/60 rounded-[2rem] overflow-hidden">
                        <div className="p-7 space-y-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-primary-200 ring-4 ring-primary-50">
                                <User className="w-7 h-7" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-dark-900 group-hover:text-primary-600 transition-colors">
                                  {slot.teacherName}
                                </h3>
                                <div className="flex items-center gap-1.5 text-xs text-dark-500 font-bold bg-dark-50 py-1 px-2.5 rounded-lg w-fit mt-1">
                                  <Clock className="w-3.5 h-3.5 text-primary-500" />
                                  <span>{formatTime(slot.fromTime)} - {formatTime(slot.toTime)}</span>
                                </div>
                              </div>
                            </div>
                            <Badge color={AVAILABILITY_STATUS_COLORS[slot.status] || 'gray'} variant="soft" className="rounded-xl px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                              {formatEnumLabel(slot.status)}
                            </Badge>
                          </div>

                          <div className="bg-gradient-to-br from-dark-50 to-white rounded-2xl p-4 border border-dark-100/50 relative">
                             {slot.note ? (
                              <div className="flex gap-3 text-sm text-dark-600 leading-relaxed italic">
                                <MessageSquare className="w-5 h-5 text-primary-500 flex-shrink-0" />
                                <p>"{slot.note}"</p>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 text-sm text-dark-400 font-medium italic">
                                <Info className="w-5 h-5 text-dark-300" />
                                <span>No special instructions</span>
                              </div>
                            )}
                          </div>

                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Detail Modal */}
      <Modal 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)}
        title="Availability Details"
        size="md"
      >
        {selectedEvent && (
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-4 bg-primary-50 rounded-3xl border border-primary-100/50">
               <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-heading shadow-xl shadow-primary-200">
                {selectedEvent.teacherName.charAt(0)}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-dark-900">{selectedEvent.teacherName}</h2>
                <div className="flex items-center gap-2">
                  <Badge color={AVAILABILITY_STATUS_COLORS[selectedEvent.status]}>
                    {formatEnumLabel(selectedEvent.status)}
                  </Badge>
                  <span className="text-dark-400 text-sm font-medium">• Professor</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-dark-100 rounded-2xl shadow-sm">
                <p className="text-xs text-dark-400 font-bold uppercase mb-1 tracking-widest">Date</p>
                <div className="flex items-center gap-2 text-dark-900 font-semibold">
                  <CalendarIcon className="w-4 h-4 text-primary-500" />
                  {formatDate(selectedEvent.date)}
                </div>
              </div>
              <div className="p-4 bg-white border border-dark-100 rounded-2xl shadow-sm">
                <p className="text-xs text-dark-400 font-bold uppercase mb-1 tracking-widest">Time Slot</p>
                <div className="flex items-center gap-2 text-dark-900 font-semibold">
                  <Clock className="w-4 h-4 text-primary-500" />
                  {formatTime(selectedEvent.fromTime)} - {formatTime(selectedEvent.toTime)}
                </div>
              </div>
            </div>

            <div className="p-5 bg-dark-50 rounded-2xl border border-dark-100">
              <p className="text-xs text-dark-400 font-bold uppercase mb-3 tracking-widest">Professor's Note</p>
              {selectedEvent.note ? (
                <p className="text-dark-700 italic leading-relaxed">"{selectedEvent.note}"</p>
              ) : (
                <p className="text-dark-400 italic">No specific instructions or location shared for this slot.</p>
              )}
            </div>

          </div>
        )}
      </Modal>
    </div>
  )
}
