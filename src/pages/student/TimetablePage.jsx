import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import studentAPI from '../../api/student.api'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import { DAYS_OF_WEEK } from '../../utils/constants'
import { formatTime } from '../../utils/formatters'

const slotColors = [
  'bg-blue-50 border-blue-200 text-blue-900',
  'bg-purple-50 border-purple-200 text-purple-900',
  'bg-emerald-50 border-emerald-200 text-emerald-900',
  'bg-orange-50 border-orange-200 text-orange-900',
  'bg-pink-50 border-pink-200 text-pink-900',
  'bg-teal-50 border-teal-200 text-teal-900',
  'bg-amber-50 border-amber-200 text-amber-900',
]

export default function StudentTimetablePage() {
  const [activeDay, setActiveDay] = useState(DAYS_OF_WEEK[Math.max(new Date().getDay() - 1, 0)])

  const { data: timetable = [], isLoading } = useQuery({
    queryKey: ['student-timetable'],
    queryFn: () => studentAPI.getTimetable().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const slotsByDay = {}
  const subjects = [...new Set(timetable.map((t) => t.subject).filter(Boolean))]
  DAYS_OF_WEEK.forEach((day) => {
    slotsByDay[day] = timetable.filter((t) => t.dayOfWeek === day).sort((a, b) => (a.fromTime || '').localeCompare(b.fromTime || ''))
  })

  const getColor = (subject) => slotColors[subjects.indexOf(subject) % slotColors.length]

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-heading text-dark-900">My Timetable</h1><p className="text-dark-500 text-sm mt-1">Your weekly class schedule</p></div>

      {/* Day Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {DAYS_OF_WEEK.map((day) => (
          <button key={day} onClick={() => setActiveDay(day)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeDay === day ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-dark-500 border border-dark-200 hover:border-dark-300'
            }`}>
            {day}
            {slotsByDay[day]?.length > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${activeDay === day ? 'bg-white/20' : 'bg-dark-100'}`}>
                {slotsByDay[day].length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Schedule */}
      {timetable.length === 0 && !isLoading ? (
        <EmptyState icon={Clock} title="No timetable" description="Your department hasn't published the timetable yet." />
      ) : (
        <div className="space-y-3">
          {(slotsByDay[activeDay] || []).length === 0 ? (
            <Card hover={false} className="text-center py-12">
              <div className="text-4xl mb-3">🏖️</div>
              <p className="text-dark-500 font-medium">No classes on {activeDay}</p>
              <p className="text-sm text-dark-400 mt-1">Enjoy your free time!</p>
            </Card>
          ) : (
            (slotsByDay[activeDay] || []).map((slot, idx) => (
              <motion.div
                key={slot.id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className={`flex items-center gap-5 border-l-4 ${getColor(slot.subject)}`}>
                  <div className="text-center min-w-[80px]">
                    <p className="text-sm font-bold">{formatTime(slot.fromTime)}</p>
                    <div className="w-px h-4 bg-dark-200 mx-auto my-1" />
                    <p className="text-sm font-bold">{formatTime(slot.toTime)}</p>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{slot.subject}</h3>
                    <p className="text-sm opacity-70">{slot.teacherName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{slot.room}</p>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
