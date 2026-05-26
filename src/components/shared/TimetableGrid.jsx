import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Edit, AlertTriangle } from 'lucide-react'
import { Skeleton } from '../ui/Skeleton'
import { DAYS_OF_WEEK, TIMETABLE_TIME_SLOTS } from '../../utils/constants'

// ─── Subject Color Palette ───
const SUBJECT_PALETTE = [
  { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', accent: 'bg-blue-500' },
  { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-800', accent: 'bg-violet-500' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', accent: 'bg-emerald-500' },
  { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', accent: 'bg-amber-500' },
  { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-800', accent: 'bg-pink-500' },
  { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-800', accent: 'bg-teal-500' },
  { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800', accent: 'bg-indigo-500' },
  { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', accent: 'bg-orange-500' },
  { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-800', accent: 'bg-cyan-500' },
  { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', accent: 'bg-rose-500' },
]

const CONFLICT_STYLE = { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800' }
const DRAFT_CLEAN_STYLE = { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' }

/**
 * Reusable weekly timetable grid.
 *
 * @param {Object[]} slots            – array of timetable slot objects
 * @param {Object[]} timeSlots        – array of { start, end, label }
 * @param {string[]} days             – array of day strings
 * @param {Function} onCellClick      – (day, timeSlot) for empty cell
 * @param {Function} onSlotClick      – (slot) for filled cell
 * @param {Function} onSlotDelete     – (slot) for delete; null = hide
 * @param {Function} renderSlotExtra  – (slot) extra content under subject
 * @param {boolean}  isReadOnly       – disable interactions
 * @param {boolean}  highlightConflicts – red bg on hasConflict slots
 * @param {boolean}  showDraftColors  – green for clean draft slots
 * @param {boolean}  loading          – show skeleton
 */
export default function TimetableGrid({
  slots = [],
  timeSlots = TIMETABLE_TIME_SLOTS,
  days = DAYS_OF_WEEK,
  onCellClick,
  onSlotClick,
  onSlotDelete,
  renderSlotExtra,
  isReadOnly = false,
  highlightConflicts = false,
  showDraftColors = false,
  loading = false,
}) {
  console.log('Grid received timetable slots:', slots)
  // ─── Build subject → color map ───
  const subjectColorMap = useMemo(() => {
    const subjects = [...new Set(slots.map((s) => s.subject).filter(Boolean))]
    const map = {}
    subjects.forEach((subj, i) => {
      map[subj] = SUBJECT_PALETTE[i % SUBJECT_PALETTE.length]
    })
    return map
  }, [slots])

  // ─── Get style for a slot ───
  const getSlotStyle = (slot) => {
    if (highlightConflicts && slot.hasConflict) return CONFLICT_STYLE
    if (showDraftColors && !slot.hasConflict) return DRAFT_CLEAN_STYLE
    return subjectColorMap[slot.subject] || SUBJECT_PALETTE[0]
  }

  // ─── Loading Skeleton ───
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-4 overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid gap-px" style={{ gridTemplateColumns: `100px repeat(${days.length}, 1fr)` }}>
            {/* Header row */}
            <div className="p-3" />
            {days.map((d) => (
              <div key={d} className="p-3 flex justify-center">
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
            {/* Body rows */}
            {timeSlots.map((ts) => (
              <>
                <div key={`sk-label-${ts.start}`} className="p-3 flex items-center">
                  <Skeleton className="h-3 w-20" />
                </div>
                {days.map((d) => (
                  <div key={`sk-${ts.start}-${d}`} className="p-2">
                    <Skeleton className="h-16 w-full rounded-xl" />
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* ─── Grid ─── */}
          <div
            className="grid"
            style={{ gridTemplateColumns: `100px repeat(${days.length}, 1fr)` }}
          >
            {/* ─── Header Row ─── */}
            <div className="sticky left-0 z-10 bg-dark-50 border-b border-r border-dark-100 p-3" />
            {days.map((day) => {
              const isToday = day === DAYS_OF_WEEK[new Date().getDay() - 1]
              return (
                <div
                  key={day}
                  className={`text-center py-3 px-2 border-b border-dark-100 font-semibold text-sm transition-colors ${
                    isToday
                      ? 'bg-primary-50 text-primary-700'
                      : 'bg-dark-50 text-dark-600'
                  }`}
                >
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.slice(0, 3)}</span>
                  {isToday && (
                    <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                  )}
                </div>
              )
            })}

            {/* ─── Body Rows ─── */}
            {timeSlots.map((ts, rowIdx) => (
              <>
                {/* Time label (sticky left) */}
                <div
                  key={`label-${ts.start}`}
                  className="sticky left-0 z-10 bg-white border-r border-b border-dark-100 px-3 py-4 flex items-center"
                >
                  <div className="text-xs font-mono text-dark-500 leading-tight">
                    <div className="font-semibold text-dark-700">{ts.start}</div>
                    <div className="text-dark-300 my-0.5">to</div>
                    <div>{ts.end}</div>
                  </div>
                </div>

                {/* Day cells */}
                {days.map((day) => {
                  const slot = slots.find(
                    (s) =>
                      String(s.dayOfWeek || '').toLowerCase() === String(day || '').toLowerCase() &&
                      String(s.startTime || s.fromTime || '').trim() === ts.start.trim()
                  )
                  const style = slot ? getSlotStyle(slot) : null

                  return (
                    <div
                      key={`cell-${ts.start}-${day}`}
                      className={`border-b border-r border-dark-100/60 p-1.5 min-h-[80px] transition-colors ${
                        !slot && !isReadOnly ? 'hover:bg-dark-50/50 cursor-pointer' : ''
                      }`}
                      onClick={() => {
                        if (!slot && !isReadOnly && onCellClick) onCellClick(day, ts)
                      }}
                    >
                      {slot ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.25, delay: rowIdx * 0.03 }}
                          className={`relative h-full rounded-xl border p-2.5 group cursor-pointer transition-all duration-200 hover:shadow-md ${style.bg} ${style.border} ${style.text}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (onSlotClick) onSlotClick(slot)
                          }}
                        >
                          {/* Conflict warning */}
                          {highlightConflicts && slot.hasConflict && (
                            <div className="absolute -top-1.5 -right-1.5 z-10" title={slot.conflictReason || 'Scheduling conflict detected'}>
                              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shadow-lg animate-pulse">
                                <AlertTriangle className="w-3 h-3 text-white" />
                              </div>
                            </div>
                          )}

                          {/* Hover actions */}
                          {!isReadOnly && (
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                              {onSlotClick && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onSlotClick(slot) }}
                                  className="p-1 rounded-lg bg-white/80 hover:bg-white shadow-sm"
                                >
                                  <Edit className="w-3 h-3 text-dark-500" />
                                </button>
                              )}
                              {onSlotDelete && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onSlotDelete(slot) }}
                                  className="p-1 rounded-lg bg-white/80 hover:bg-red-50 shadow-sm"
                                >
                                  <Trash2 className="w-3 h-3 text-red-500" />
                                </button>
                              )}
                            </div>
                          )}

                          {/* Subject color accent bar */}
                          {!highlightConflicts && subjectColorMap[slot.subject] && (
                            <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${subjectColorMap[slot.subject].accent}`} />
                          )}

                          {/* Content */}
                          <p className="text-xs font-bold leading-tight truncate pl-1">{slot.subject}</p>
                          {slot.teacherName && (
                            <p className="text-[10px] opacity-70 mt-1 truncate pl-1">{slot.teacherName}</p>
                          )}
                          {slot.room && (
                            <p className="text-[10px] opacity-50 mt-0.5 truncate pl-1">{slot.room}</p>
                          )}
                          {renderSlotExtra && renderSlotExtra(slot)}
                        </motion.div>
                      ) : (
                        /* Empty cell — show + icon on hover */
                        !isReadOnly && onCellClick && (
                          <div className="h-full flex items-center justify-center opacity-0 hover:opacity-40 transition-opacity">
                            <Plus className="w-5 h-5 text-dark-300" />
                          </div>
                        )
                      )}
                    </div>
                  )
                })}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
