import { useQuery } from '@tanstack/react-query'
import { Calendar } from 'lucide-react'
import professorAPI from '../../api/professor.api'
import EmptyState from '../../components/ui/EmptyState'
import TimetableGrid from '../../components/shared/TimetableGrid'

export default function ProfessorTimetablePage() {
  // ─── Fetch Teaching Schedule ───
  const { data: teachingSlots = [], isLoading } = useQuery({
    queryKey: ['prof-timetable-teaching'],
    queryFn: () => professorAPI.getMyTimetable().then((r) =>
      Array.isArray(r.data?.data) ? r.data.data : Array.isArray(r.data) ? r.data : []
    ),
  })

  const renderSlotExtra = (slot) => {
    return (
      <div className="mt-1.5 flex flex-wrap gap-1">
        <span className="inline-block px-1.5 py-0.5 text-[9px] bg-primary-100 text-primary-800 rounded-md font-bold uppercase tracking-wide">
          {slot.year} Div {slot.division}
        </span>
        <span className="inline-block px-1.5 py-0.5 text-[9px] bg-dark-100 text-dark-800 rounded-md font-bold">
          Sem {slot.semester}
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-dark-900">
          My <span className="text-primary-600">Schedule</span>
        </h1>
        <p className="text-dark-500 text-sm mt-1">Manage and view your teaching hours</p>
      </div>

      {/* Grid Content */}
      <div>
        {teachingSlots.length === 0 && !isLoading ? (
          <EmptyState
            icon={Calendar}
            title="No classes scheduled"
            description="Your department has not assigned any weekly lectures for you yet."
          />
        ) : (
          <TimetableGrid
            slots={teachingSlots}
            loading={isLoading}
            isReadOnly
            renderSlotExtra={renderSlotExtra}
          />
        )}
      </div>
    </div>
  )
}
