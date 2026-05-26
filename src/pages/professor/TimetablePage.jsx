import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, LayoutGrid, Layers, Info } from 'lucide-react'
import professorAPI from '../../api/professor.api'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import TimetableGrid from '../../components/shared/TimetableGrid'

export default function ProfessorTimetablePage() {
  const [activeTab, setActiveTab] = useState('teaching') // teaching | merged

  // ─── Fetch Teaching Schedule ───
  const { data: teachingSlots = [], isLoading: teachingLoading } = useQuery({
    queryKey: ['prof-timetable-teaching'],
    queryFn: () => professorAPI.getMyTimetable().then((r) =>
      Array.isArray(r.data?.data) ? r.data.data : Array.isArray(r.data) ? r.data : []
    ),
  })

  // ─── Fetch Merged Schedule (Teaching + Consultation Availability) ───
  const { data: mergedSlots = [], isLoading: mergedLoading } = useQuery({
    queryKey: ['prof-timetable-merged'],
    queryFn: () => professorAPI.getMergedSchedule().then((r) => {
      const data = Array.isArray(r.data?.data) ? r.data.data : Array.isArray(r.data) ? r.data : []
      return data.map((slot) => {
        if (slot.type === 'AVAILABILITY') {
          return {
            ...slot,
            subject: 'Consultation Block',
          }
        }
        return slot
      })
    }),
  })

  const isLoading = activeTab === 'teaching' ? teachingLoading : mergedLoading
  const currentSlots = activeTab === 'teaching' ? teachingSlots : mergedSlots

  const renderSlotExtra = (slot) => {
    if (slot.type === 'AVAILABILITY') {
      return (
        <div className="mt-1">
          <span className="inline-block px-1.5 py-0.5 text-[9px] bg-emerald-100 text-emerald-800 rounded-md font-bold uppercase tracking-wide">
            Consultation
          </span>
        </div>
      )
    }
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
        <p className="text-dark-500 text-sm mt-1">Manage and view your teaching hours and consultation blocks</p>
      </div>

      {/* Tab Switcher & Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex bg-white p-1.5 rounded-2xl border border-dark-200 shadow-sm w-fit">
          <button
            onClick={() => setActiveTab('teaching')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === 'teaching'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                : 'text-dark-500 hover:text-dark-700 hover:bg-dark-50'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Teaching Schedule
          </button>
          <button
            onClick={() => setActiveTab('merged')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === 'merged'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200'
                : 'text-dark-500 hover:text-dark-700 hover:bg-dark-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            Merged Schedule
          </button>
        </div>

        {activeTab === 'merged' && (
          <div className="flex items-center gap-1.5 text-xs text-violet-600 bg-violet-50 px-3 py-2 rounded-xl font-medium border border-violet-100/50">
            <Info className="w-4 h-4 shrink-0" />
            Showing class timetable overlaid with consultation hours
          </div>
        )}
      </div>

      {/* Grid Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          {currentSlots.length === 0 && !isLoading ? (
            <EmptyState
              icon={Calendar}
              title={activeTab === 'teaching' ? 'No classes scheduled' : 'No classes or consultation hours set'}
              description={
                activeTab === 'teaching'
                  ? 'Your department has not assigned any weekly lectures for you yet.'
                  : 'Add consultation hours in the Availability tab to see them overlaid here.'
              }
            />
          ) : (
            <TimetableGrid
              slots={currentSlots}
              loading={isLoading}
              isReadOnly
              renderSlotExtra={renderSlotExtra}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
