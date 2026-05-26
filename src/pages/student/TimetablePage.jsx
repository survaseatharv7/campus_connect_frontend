import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Calendar, Info } from 'lucide-react'
import studentAPI from '../../api/student.api'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import TimetableGrid from '../../components/shared/TimetableGrid'
import { Skeleton } from '../../components/ui/Skeleton'
import {
  YEAR_LABELS, DIVISIONS, SEMESTERS
} from '../../utils/constants'

export default function StudentTimetablePage() {
  const [year, setYear] = useState('')
  const [semester, setSemester] = useState('')
  const [division, setDivision] = useState('')

  // ─── Fetch Student Profile ───
  const { data: profile } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: () => studentAPI.getProfile().then((r) => r.data),
  })

  // ─── Auto-populate filters from profile ───
  useEffect(() => {
    if (profile) {
      if (profile.year && !year) setYear(String(profile.year))
      if (profile.semester && !semester) setSemester(String(profile.semester))
      if (profile.division && !division) setDivision(profile.division)
    }
  }, [profile])

  const filtersReady = !!(year && semester && division)

  // ─── Fetch Timetable slots ───
  const { data: timetable = [], isLoading } = useQuery({
    queryKey: ['student-timetable', year, semester, division],
    queryFn: async () => {
      console.log('Fetching timetable with:', { year, semester, division })
      const res = await studentAPI.getTimetable(year, semester, division)
      console.log('Timetable API Response:', res.data)
      const mapped = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
      console.log('Mapped timetable:', mapped)
      return mapped
    },
    enabled: filtersReady,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-dark-900">
          Class <span className="text-primary-600">Schedule</span>
        </h1>
        <p className="text-dark-500 text-sm mt-1">View weekly class schedules and lectures</p>
      </div>

      {/* Filter Bar */}
      <Card hover={false} className="!p-4 bg-white/50 backdrop-blur-md border-none shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <FilterDropdown
            label="Year"
            value={year}
            onChange={setYear}
            options={Object.entries(YEAR_LABELS).map(([v, l]) => ({ value: v, label: l }))}
            placeholder="Select Year"
          />
          <FilterDropdown
            label="Semester"
            value={semester}
            onChange={setSemester}
            options={SEMESTERS.map((s) => ({ value: String(s.value), label: s.label }))}
            placeholder="Select Sem"
          />
          <FilterDropdown
            label="Division"
            value={division}
            onChange={setDivision}
            options={DIVISIONS.map((d) => ({ value: d, label: `Division ${d}` }))}
            placeholder="Select Div"
          />

          {filtersReady && profile && (
            <div className="flex items-center gap-1.5 text-xs text-primary-600 bg-primary-50 px-3 py-2 rounded-xl font-medium border border-primary-100/50 sm:ml-auto">
              <Info className="w-4 h-4 shrink-0" />
              Showing {year === String(profile.year) && division === profile.division ? 'your class schedule' : 'selected class schedule'}
            </div>
          )}
        </div>
      </Card>

      {/* Grid Content */}
      {!filtersReady ? (
        <EmptyState
          icon={Calendar}
          title="Select filters to view timetable"
          description="Choose year, semester, and division from the dropdowns above to load the weekly schedule."
        />
      ) : timetable.length === 0 && !isLoading ? (
        <EmptyState
          icon={Calendar}
          title="No timetable found"
          description={`No classes have been published yet for ${YEAR_LABELS[year]} – Sem ${semester} – Div ${division}.`}
        />
      ) : (
        <TimetableGrid
          slots={timetable}
          loading={isLoading}
          isReadOnly
        />
      )}
    </div>
  )
}

// ─── Local Reusable FilterDropdown ───
function FilterDropdown({ label, value, onChange, options, placeholder }) {
  return (
    <div className="min-w-[140px] flex-1 sm:flex-initial">
      <label className="block text-xs font-semibold text-dark-500 mb-1.5 uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 bg-white border border-dark-200 rounded-xl text-sm text-dark-900 font-medium focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 hover:border-dark-300 transition-all cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
