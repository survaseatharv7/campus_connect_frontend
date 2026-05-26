import { useQuery } from '@tanstack/react-query'
import { Calendar, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import studentAPI from '../../api/student.api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import TimetableGrid from '../../components/shared/TimetableGrid'
import { YEAR_LABELS } from '../../utils/constants'

export default function StudentTimetablePage() {
  const navigate = useNavigate()

  // ─── Fetch Student Profile ───
  const { data: profileResponse, isLoading: isProfileLoading } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: () => studentAPI.getProfile().then((r) => r.data),
  })

  const profile = profileResponse?.data || {}

  // ─── Fetch Timetable slots ───
  const { data: timetable = [], isLoading: isTimetableLoading } = useQuery({
    queryKey: ['student-timetable'],
    queryFn: async () => {
      console.log('Fetching student timetable')
      const res = await studentAPI.getTimetable()
      console.log('Timetable API Response:', res.data)
      const mapped = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
      console.log('Mapped timetable:', mapped)
      return mapped
    },
    enabled: !!(profile.year && profile.semester && profile.division),
  })

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!profile.year || !profile.semester || !profile.division) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-dark-900">
            Class <span className="text-primary-600">Schedule</span>
          </h1>
          <p className="text-dark-500 text-sm mt-1">View weekly class schedules and lectures</p>
        </div>
        <Card className="p-8 text-center flex flex-col items-center justify-center border-none shadow-sm bg-white/50 backdrop-blur-md">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4 animate-bounce">
            <Info className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-heading text-dark-900 mb-2">Academic Profile Incomplete</h2>
          <p className="text-dark-500 max-w-md mb-6">
            ⚠️ Your academic profile is incomplete. Please update your year, semester, and division in Profile settings to see your timetable.
          </p>
          <Button onClick={() => navigate('/student/profile')}>
            Go to Profile Settings
          </Button>
        </Card>
      </div>
    )
  }

  const yearLabel = YEAR_LABELS[profile.year] || `Year ${profile.year}`
  const semLabel = `Semester ${profile.semester}`
  const divLabel = `Division ${profile.division}`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-dark-900">
            📅 Your Timetable — <span className="text-primary-600">{`${yearLabel} · ${semLabel} · ${divLabel}`}</span>
          </h1>
          <p className="text-dark-500 text-sm mt-1">View your weekly class schedule and lectures</p>
        </div>
      </div>

      {/* Grid Content */}
      {timetable.length === 0 && !isTimetableLoading ? (
        <EmptyState
          icon={Calendar}
          title="No timetable published"
          description="No timetable published for your class yet. Check back later."
        />
      ) : (
        <TimetableGrid
          slots={timetable}
          loading={isTimetableLoading}
          isReadOnly
        />
      )}
    </div>
  )
}
