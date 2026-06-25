import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Clock, Plus, Trash2, Sparkles, Archive, AlertTriangle,
  CheckCircle2, ChevronRight, ChevronLeft, RefreshCw,
  Send, X, Calendar, LayoutGrid, List, Loader2, Info
} from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../../store/authStore'
import hodAPI from '../../api/hod.api'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import SearchSelect from '../../components/ui/SearchSelect'
import TimetableGrid from '../../components/shared/TimetableGrid'
import { Skeleton } from '../../components/ui/Skeleton'
import {
  DAYS_OF_WEEK, YEARS, SEMESTERS, YEAR_LABELS, DIVISIONS, TIMETABLE_TIME_SLOTS
} from '../../utils/constants'

// ─── Manual Slot Schema ───
const manualSlotSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  teacherId: z.string().min(1, 'Professor is required'),
  dayOfWeek: z.string().min(1, 'Day is required'),
  fromTime: z.string().min(1, 'Start time is required'),
  toTime: z.string().min(1, 'End time is required'),
  room: z.string().optional(),
})

// ─── Main Component ───
export default function TimetablePage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('current') // current | ai

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-dark-900">
            Department <span className="text-primary-600">Timetable</span>
          </h1>
          <p className="text-dark-500 text-sm mt-1">Manage, generate, and publish weekly class schedules</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-dark-200 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab('current')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'current'
            ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
            : 'text-dark-500 hover:text-dark-700 hover:bg-dark-50'
            }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Current Timetable
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'ai'
            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200'
            : 'text-dark-500 hover:text-dark-700 hover:bg-dark-50'
            }`}
        >
          <Sparkles className="w-4 h-4" />
          AI Generate
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'current' ? (
          <motion.div key="current" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <CurrentTimetableTab queryClient={queryClient} />
          </motion.div>
        ) : (
          <motion.div key="ai" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <AIGenerateTab queryClient={queryClient} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════
// TAB 1: CURRENT TIMETABLE
// ════════════════════════════════════════════════════════════════════
function CurrentTimetableTab({ queryClient }) {
  const [year, setYear] = useState('')
  const [semester, setSemester] = useState('')
  const [division, setDivision] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [addContext, setAddContext] = useState({ day: '', fromTime: '', toTime: '' })
  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false)

  const filtersReady = !!(year && semester && division)

  // ─── Fetch timetable ───
  const { data: timetable = [], isLoading } = useQuery({
    queryKey: ['hod-timetable', year, semester, division],
    queryFn: () => hodAPI.getTimetable(year, semester, division).then((r) =>
      Array.isArray(r.data?.data) ? r.data.data : Array.isArray(r.data) ? r.data : []
    ),
    enabled: filtersReady,
  })

  const filteredTimetable = useMemo(() => {
    if (!filtersReady) return []
    const selectedYearCode = YEAR_LABELS[year] || year
    return timetable.filter((s) => {
      const slotYearCode = YEAR_LABELS[s.year] || s.year
      return (
        String(slotYearCode).toLowerCase() === String(selectedYearCode).toLowerCase() &&
        String(s.semester) === String(semester) &&
        String(s.division).toLowerCase() === String(division).toLowerCase()
      );
    });
  }, [timetable, year, semester, division, filtersReady])

  // ─── Archived timetable ───
  const { data: archivedSlots = [], isLoading: archiveLoading } = useQuery({
    queryKey: ['hod-timetable-archived'],
    queryFn: () => hodAPI.getArchivedTimetable().then((r) =>
      Array.isArray(r.data?.data) ? r.data.data : Array.isArray(r.data) ? r.data : []
    ),
    enabled: showArchived,
  })

  // ─── Delete mutation ───
  const deleteMutation = useMutation({
    mutationFn: (id) => hodAPI.deleteTimetableSlot(id),
    onSuccess: () => {
      toast.success('Slot deleted')
      queryClient.invalidateQueries({ queryKey: ['hod-timetable'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed'),
  })

  // ─── Archive mutation ───
  const archiveMutation = useMutation({
    mutationFn: () => hodAPI.archiveSemester(year, semester, division),
    onSuccess: () => {
      toast.success('Semester archived successfully')
      queryClient.invalidateQueries({ queryKey: ['hod-timetable'] })
      setArchiveConfirmOpen(false)
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Archive failed'),
  })

  const handleCellClick = (day, ts) => {
    setAddContext({ day, fromTime: ts.start, toTime: ts.end })
    setAddModalOpen(true)
  }

  return (
    <div className="space-y-5">
      {/* Filter Bar */}
      <Card hover={false} className="!p-4">
        <div className="flex flex-wrap items-end gap-4">
          <FilterDropdown label="Year" value={year} onChange={setYear}
            options={Object.entries(YEAR_LABELS).map(([v, l]) => ({ value: v, label: l }))} placeholder="Select Year" />
          <FilterDropdown label="Semester" value={semester} onChange={setSemester}
            options={SEMESTERS.map((s) => ({ value: String(s.value), label: s.label }))} placeholder="Select Sem" />
          <FilterDropdown label="Division" value={division} onChange={setDivision}
            options={DIVISIONS.map((d) => ({ value: d, label: `Division ${d}` }))} placeholder="Select Div" />

          <div className="flex items-center gap-2 ml-auto">
            <div className="flex bg-dark-50 p-1 rounded-xl border border-dark-100">
              <button
                onClick={() => setShowArchived(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${!showArchived ? 'bg-white text-dark-900 shadow-sm' : 'text-dark-400'}`}
              >
                Active
              </button>
              <button
                onClick={() => setShowArchived(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${showArchived ? 'bg-white text-dark-900 shadow-sm' : 'text-dark-400'}`}
              >
                Archived
              </button>
            </div>

            {filtersReady && !showArchived && (
              <>
                <Button size="sm" icon={Plus} onClick={() => { setAddContext({ day: '', fromTime: '', toTime: '' }); setAddModalOpen(true) }}>
                  Add Slot
                </Button>
                <Button size="sm" variant="danger" icon={Archive} onClick={() => setArchiveConfirmOpen(true)}>
                  Archive
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Content */}
      {showArchived ? (
        <ArchivedView slots={archivedSlots} loading={archiveLoading} />
      ) : !filtersReady ? (
        <EmptyState
          icon={Calendar}
          title="Select filters to view timetable"
          description="Choose year, semester, and division from the dropdowns above to load the schedule."
        />
      ) : (
        <TimetableGrid
          slots={filteredTimetable}
          loading={isLoading}
          onCellClick={handleCellClick}
          onSlotDelete={(slot) => deleteMutation.mutate(slot.id)}
        />
      )}

      {/* Manual Add Modal */}
      <ManualAddModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        defaultDay={addContext.day}
        defaultFromTime={addContext.fromTime}
        defaultToTime={addContext.toTime}
        filterYear={year}
        filterSemester={semester}
        filterDivision={division}
        queryClient={queryClient}
      />

      {/* Archive Confirmation */}
      <Modal
        isOpen={archiveConfirmOpen}
        onClose={() => setArchiveConfirmOpen(false)}
        title="Archive Semester"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setArchiveConfirmOpen(false)}>Cancel</Button>
            <Button variant="danger" icon={Archive} onClick={() => archiveMutation.mutate()} loading={archiveMutation.isPending}>
              Confirm Archive
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              This will archive the timetable for <strong>{YEAR_LABELS[year]} – Sem {semester} – Div {division}</strong>.
              This action cannot be easily undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════
// ARCHIVED VIEW
// ════════════════════════════════════════════════════════════════════
function ArchivedView({ slots, loading }) {
  const grouped = useMemo(() => {
    const map = {}
    slots.forEach((s) => {
      const key = `${YEAR_LABELS[s.year] || s.year} – Sem ${s.semester} – Div ${s.division}`
      if (!map[key]) map[key] = []
      map[key].push(s)
    })
    return Object.entries(map)
  }, [slots])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    )
  }

  if (grouped.length === 0) {
    return <EmptyState icon={Archive} title="No archived timetables" description="Archived semesters will appear here." />
  }

  return (
    <div className="space-y-6">
      {grouped.map(([label, items]) => (
        <Card key={label} hover={false}>
          <h3 className="text-sm font-bold text-dark-700 mb-3 flex items-center gap-2">
            <Archive className="w-4 h-4 text-dark-400" />
            {label}
            <Badge color="gray" size="sm">{items.length} slots</Badge>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {items.map((slot) => (
              <div key={slot.id} className="px-3 py-2 rounded-xl bg-dark-50 border border-dark-100 text-sm">
                <span className="font-semibold text-dark-900">{slot.subject}</span>
                <span className="text-dark-400 ml-2">• {slot.dayOfWeek?.slice(0, 3)} {slot.fromTime}–{slot.toTime}</span>
                {slot.teacherName && <span className="text-dark-400 ml-1">• {slot.teacherName}</span>}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════
// TAB 2: AI GENERATE
// ════════════════════════════════════════════════════════════════════
function AIGenerateTab({ queryClient }) {
  const [step, setStep] = useState(1)

  // Step 1 state
  const [year, setYear] = useState('')
  const [semester, setSemester] = useState('')
  const [division, setDivision] = useState('')
  const [workingDays, setWorkingDays] = useState([...DAYS_OF_WEEK])
  const [selectedTimeSlots, setSelectedTimeSlots] = useState(TIMETABLE_TIME_SLOTS.map((t) => t.start))

  // Step 2 state
  const [assignments, setAssignments] = useState([{ teacherId: '', teacherName: '', subject: '', lecturesPerWeek: 3 }])

  // Step 3 state
  const [draftSlots, setDraftSlots] = useState([])

  // Professors query
  const { data: professors = [], isLoading: profsLoading } = useQuery({
    queryKey: ['hod-professors'],
    queryFn: () => hodAPI.getProfessors().then((r) => Array.isArray(r.data?.data) ? r.data.data : Array.isArray(r.data) ? r.data : []),
  })

  // AI mutation
  const aiMutation = useMutation({
    mutationFn: (data) => hodAPI.generateAISuggestion(data),
    onSuccess: (res) => {
      const slots = res.data?.data || res.data || []
      setDraftSlots(slots)
      setStep(3)
      toast.success('AI timetable generated!')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'AI generation failed'),
  })

  // Publish mutation
  const publishMutation = useMutation({
    mutationFn: (slots) => hodAPI.publishTimetable(slots.map(s => ({
      subject: s.subject,
      teacherId: s.teacherId,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime || s.fromTime,
      endTime: s.endTime || s.toTime,
      room: s.room || '',
      year: String(s.year),
      semester: Number(s.semester),
      division: s.division,
    }))),
    onSuccess: () => {
      toast.success('Timetable published successfully!')
      queryClient.invalidateQueries({ queryKey: ['hod-timetable'] })
      setStep(1)
      setDraftSlots([])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Publish failed'),
  })

  const conflictCount = draftSlots.filter((s) => s.hasConflict).length
  const canPublish = draftSlots.length > 0 && conflictCount === 0

  const handleGenerate = () => {
    const teacherSubjectMappings = assignments.map((a) => ({
      teacherId: a.teacherId,
      teacherName: a.teacherName,
      subject: a.subject,
      lecturesPerWeek: Number(a.lecturesPerWeek),
    }))
    const timeSlots = selectedTimeSlots.map((start) => {
      const ts = TIMETABLE_TIME_SLOTS.find((t) => t.start === start)
      return ts ? `${ts.start}-${ts.end}` : start
    })
    aiMutation.mutate({ year, semester: Number(semester), division, teacherSubjectMappings, workingDays, timeSlots })
  }

  const step1Valid = year && semester && division && workingDays.length > 0 && selectedTimeSlots.length > 0
  const step2Valid = assignments.length > 0 && assignments.every((a) => a.teacherId && a.subject && a.lecturesPerWeek > 0)

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2">
        {[
          { num: 1, label: 'Target' },
          { num: 2, label: 'Assignments' },
          { num: 3, label: 'Review' },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step === s.num ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 scale-110' :
              step > s.num ? 'bg-emerald-500 text-white' : 'bg-dark-100 text-dark-400'
              }`}>
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </div>
            <span className={`text-xs font-semibold hidden sm:inline ${step === s.num ? 'text-primary-600' : 'text-dark-400'}`}>
              {s.label}
            </span>
            {i < 2 && <div className={`w-10 h-0.5 rounded-full ${step > s.num ? 'bg-emerald-400' : 'bg-dark-100'}`} />}
          </div>
        ))}
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card hover={false}>
              <h2 className="text-lg font-bold text-dark-900 mb-5 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-500" />
                Target Selection
              </h2>

              <div className="space-y-6">
                {/* Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FilterDropdown label="Year" value={year} onChange={setYear}
                    options={Object.entries(YEAR_LABELS).map(([v, l]) => ({ value: v, label: l }))} placeholder="Select Year" />
                  <FilterDropdown label="Semester" value={semester} onChange={setSemester}
                    options={SEMESTERS.map((s) => ({ value: String(s.value), label: s.label }))} placeholder="Select Sem" />
                  <FilterDropdown label="Division" value={division} onChange={setDivision}
                    options={DIVISIONS.map((d) => ({ value: d, label: `Division ${d}` }))} placeholder="Select Div" />
                </div>

                {/* Working Days */}
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">Working Days</label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => {
                      const checked = workingDays.includes(day)
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            setWorkingDays((prev) => checked ? prev.filter((d) => d !== day) : [...prev, day])
                          }}
                          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${checked
                            ? 'bg-primary-50 border-primary-300 text-primary-700 shadow-sm'
                            : 'bg-white border-dark-200 text-dark-400 hover:border-dark-300'
                            }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">Time Slots</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TIMETABLE_TIME_SLOTS.map((ts) => {
                      const checked = selectedTimeSlots.includes(ts.start)
                      return (
                        <button
                          key={ts.start}
                          type="button"
                          onClick={() => {
                            setSelectedTimeSlots((prev) => checked ? prev.filter((s) => s !== ts.start) : [...prev, ts.start])
                          }}
                          className={`px-3 py-2.5 rounded-xl text-sm font-mono border transition-all duration-200 ${checked
                            ? 'bg-primary-50 border-primary-300 text-primary-700 shadow-sm'
                            : 'bg-white border-dark-200 text-dark-400 hover:border-dark-300'
                            }`}
                        >
                          <Clock className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                          {ts.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button icon={ChevronRight} iconPosition="right" disabled={!step1Valid} onClick={() => setStep(2)}>
                    Next: Assign Teachers
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card hover={false}>
              <h2 className="text-lg font-bold text-dark-900 mb-5 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                Teacher–Subject Assignments
              </h2>

              <div className="space-y-4">
                {/* Assignment rows */}
                <div className="space-y-3">
                  {assignments.map((row, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end p-4 bg-dark-50 rounded-xl border border-dark-100"
                    >
                      <div className="sm:col-span-4">
                        <SearchSelect
                          label="Professor"
                          placeholder="Search professor..."
                          options={professors.map((p) => ({ id: p.id, name: p.name, email: p.email }))}
                          value={row.teacherId}
                          onChange={(id) => {
                            const prof = professors.find((p) => p.id === id)
                            setAssignments((prev) => prev.map((a, i) => i === idx ? { ...a, teacherId: id, teacherName: prof?.name || '' } : a))
                          }}
                          isLoading={profsLoading}
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <Input
                          label="Subject"
                          placeholder="e.g. Data Structures"
                          value={row.subject}
                          onChange={(e) => setAssignments((prev) => prev.map((a, i) => i === idx ? { ...a, subject: e.target.value } : a))}
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <Input
                          label="Lectures/Week"
                          type="number"
                          min={1}
                          max={6}
                          value={row.lecturesPerWeek}
                          onChange={(e) => setAssignments((prev) => prev.map((a, i) => i === idx ? { ...a, lecturesPerWeek: e.target.value } : a))}
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-center">
                        {assignments.length > 1 && (
                          <button
                            onClick={() => setAssignments((prev) => prev.filter((_, i) => i !== idx))}
                            className="p-2 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  icon={Plus}
                  onClick={() => setAssignments((prev) => [...prev, { teacherId: '', teacherName: '', subject: '', lecturesPerWeek: 3 }])}
                >
                  Add Teacher–Subject Pair
                </Button>

                <div className="flex justify-between pt-4 border-t border-dark-100">
                  <Button variant="secondary" icon={ChevronLeft} onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    disabled={!step2Valid}
                    loading={aiMutation.isPending}
                    onClick={handleGenerate}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                  >
                    {aiMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        AI is generating your timetable...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Timetable
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="space-y-5">
              {/* Conflict Banner */}
              {conflictCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800 font-medium">
                    <strong>{conflictCount}</strong> conflict{conflictCount > 1 ? 's' : ''} detected — resolve before publishing
                  </p>
                </motion.div>
              )}

              {conflictCount === 0 && draftSlots.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <p className="text-sm text-emerald-800 font-medium">
                    All {draftSlots.length} slots are conflict-free. Ready to publish!
                  </p>
                </motion.div>
              )}

              {/* Draft info */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-dark-900 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-primary-500" />
                  Review Draft — {YEAR_LABELS[year]} Sem {semester} Div {division}
                </h2>
                <Badge color="blue" size="lg">{draftSlots.length} slots</Badge>
              </div>

              {/* Draft Grid */}
              <TimetableGrid
                slots={draftSlots}
                highlightConflicts
                showDraftColors
                onSlotDelete={(slot) => {
                  setDraftSlots((prev) => prev.filter((s) => s !== slot))
                  toast.success('Slot removed from draft')
                }}
              />

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
                <Button variant="secondary" icon={RefreshCw} onClick={() => setStep(2)}>
                  Re-generate
                </Button>
                <Button
                  disabled={!canPublish}
                  loading={publishMutation.isPending}
                  icon={Send}
                  onClick={() => publishMutation.mutate(draftSlots)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  Approve & Publish
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════
// MANUAL ADD MODAL
// ════════════════════════════════════════════════════════════════════
function ManualAddModal({
  isOpen, onClose, defaultDay, defaultFromTime, defaultToTime,
  filterYear, filterSemester, filterDivision, queryClient,
}) {
  const form = useForm({
    resolver: zodResolver(manualSlotSchema),
    defaultValues: {
      subject: '', teacherId: '', dayOfWeek: defaultDay, fromTime: defaultFromTime, toTime: defaultToTime, room: '',
    },
  })

  // Reset when context changes
  useState(() => {
    if (isOpen) {
      form.reset({
        subject: '', teacherId: '', dayOfWeek: defaultDay, fromTime: defaultFromTime, toTime: defaultToTime, room: '',
      })
    }
  }, [isOpen, defaultDay, defaultFromTime, defaultToTime])

  const { data: professors = [], isLoading: professorsLoading } = useQuery({
    queryKey: ['hod-professors'],
    queryFn: () => hodAPI.getProfessors().then((r) => Array.isArray(r.data?.data) ? r.data.data : Array.isArray(r.data) ? r.data : []),
  })

  const createMutation = useMutation({
    mutationFn: (data) => hodAPI.createTimetable({
      subject: data.subject,
      teacherId: data.teacherId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.fromTime,
      endTime: data.toTime,
      room: data.room,
      year: filterYear,
      semester: Number(filterSemester),
      division: filterDivision,
      status: 'PUBLISHED',
    }),
    onSuccess: () => {
      toast.success('Slot added!')
      queryClient.invalidateQueries({ queryKey: ['hod-timetable'] })
      onClose()
      form.reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add slot'),
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { onClose(); form.reset() }}
      title="Add Timetable Slot"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={form.handleSubmit((d) => createMutation.mutate(d))} loading={createMutation.isPending}>
            Add Slot
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <SearchSelect
          label="Professor"
          placeholder="Search professor..."
          options={professors.map((p) => ({ id: p.id, name: p.name, email: p.email }))}
          value={form.watch('teacherId')}
          onChange={(val) => form.setValue('teacherId', val, { shouldValidate: true })}
          isLoading={professorsLoading}
          error={form.formState.errors.teacherId?.message}
        />
        <Input label="Subject" placeholder="e.g. Data Structures" error={form.formState.errors.subject?.message} {...form.register('subject')} />
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-1.5">Day of Week</label>
          <select className="w-full px-4 py-3 bg-white border border-dark-200 rounded-xl text-dark-900 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" {...form.register('dayOfWeek')}>
            <option value="">Select day</option>
            {DAYS_OF_WEEK.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          {form.formState.errors.dayOfWeek && <p className="mt-1 text-sm text-red-500">{form.formState.errors.dayOfWeek.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Start Time</label>
            <select className="w-full px-4 py-3 bg-white border border-dark-200 rounded-xl text-dark-900 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" {...form.register('fromTime')}>
              <option value="">Select</option>
              {TIMETABLE_TIME_SLOTS.map((ts) => <option key={ts.start} value={ts.start}>{ts.start}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">End Time</label>
            <select className="w-full px-4 py-3 bg-white border border-dark-200 rounded-xl text-dark-900 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" {...form.register('toTime')}>
              <option value="">Select</option>
              {TIMETABLE_TIME_SLOTS.map((ts) => <option key={ts.end} value={ts.end}>{ts.end}</option>)}
            </select>
          </div>
        </div>
        <Input label="Room" placeholder="e.g. Room 301 (optional)" {...form.register('room')} />
      </div>
    </Modal>
  )
}

// ════════════════════════════════════════════════════════════════════
// FILTER DROPDOWN (reusable)
// ════════════════════════════════════════════════════════════════════
function FilterDropdown({ label, value, onChange, options, placeholder }) {
  return (
    <div className="min-w-[140px]">
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
