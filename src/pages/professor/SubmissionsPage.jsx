import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ClipboardList, FileText, Download, Eye, User, Calendar } from 'lucide-react'
import professorAPI from '../../api/professor.api'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { formatDate, formatEnumLabel } from '../../utils/formatters'
import { SUBMISSION_STATUS_COLORS } from '../../utils/constants'

export default function SubmissionsPage() {
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['prof-submissions'],
    queryFn: () => professorAPI.getSubmissions().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-heading text-dark-900">Student Submissions</h1><p className="text-dark-500 text-sm mt-1">Review and grade student work submissions</p></div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-6">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : submissions.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No submissions" description="No student submissions to review yet." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {submissions.map((sub, idx) => (
            <motion.div key={sub.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center"><ClipboardList className="w-5 h-5 text-purple-600" /></div>
                  <Badge color={SUBMISSION_STATUS_COLORS[sub.status] || 'gray'} size="sm" dot>{formatEnumLabel(sub.status || 'SUBMITTED')}</Badge>
                </div>
                <h3 className="text-lg font-semibold font-heading text-dark-900 mb-1">{sub.title || sub.assignmentTitle || 'Submission'}</h3>
                <p className="text-sm text-dark-500 mb-3 line-clamp-2">{sub.description}</p>
                <div className="space-y-1.5 text-sm text-dark-500 mb-4">
                  <div className="flex items-center gap-2"><User className="w-4 h-4 text-dark-400" />{sub.studentName || 'Student'}</div>
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-dark-400" />{formatDate(sub.submittedAt || sub.createdAt)}</div>
                </div>
                {sub.marks !== undefined && sub.marks !== null && (
                  <div className="mb-3 px-3 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-medium">
                    Marks: {sub.marks}{sub.totalMarks ? ` / ${sub.totalMarks}` : ''}
                  </div>
                )}
                {sub.fileUrl && (
                  <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium">
                    <Download className="w-4 h-4" /> View Submission File
                  </a>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
