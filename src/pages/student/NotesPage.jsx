import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FileText, Download, Search, BookOpen, Calendar } from 'lucide-react'
import studentAPI from '../../api/student.api'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { formatDate } from '../../utils/formatters'

export default function StudentNotesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['student-notes'],
    queryFn: () => studentAPI.getNotes().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const filtered = notes.filter((n) =>
    n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-heading text-dark-900">Study Notes</h1><p className="text-dark-500 text-sm mt-1">Browse study materials from your professors</p></div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
        <input type="text" placeholder="Search by title or subject..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-10" />
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No notes found" description={searchTerm ? 'Try different keywords.' : 'No study materials available yet.'} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((note, idx) => (
            <motion.div key={note.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card className="group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center"><FileText className="w-5 h-5 text-emerald-600" /></div>
                </div>
                <h3 className="text-lg font-semibold font-heading text-dark-900 mb-1">{note.title}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge color="blue" size="sm">{note.subject}</Badge>
                  {note.year && <Badge color="gray" size="sm">{note.year}</Badge>}
                  {note.semester && <Badge color="gray" size="sm">Sem {note.semester}</Badge>}
                </div>
                {note.description && <p className="text-sm text-dark-500 mb-3 line-clamp-2">{note.description}</p>}
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-xs text-dark-400 flex items-center gap-1"><BookOpen className="w-3 h-3" />{note.uploadedByName || 'Professor'}</div>
                  {note.fileUrl && (
                    <a href={note.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium">
                      <Download className="w-4 h-4" /> Download
                    </a>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
