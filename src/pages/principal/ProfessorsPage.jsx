import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Users, Mail, Phone } from 'lucide-react'
import principalAPI from '../../api/principal.api'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { getInitials } from '../../utils/formatters'

export default function ProfessorsPage() {
  const { data: professors = [], isLoading } = useQuery({
    queryKey: ['principal-professors'],
    queryFn: () => principalAPI.getProfessors().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-dark-900">Professors</h1>
        <p className="text-dark-500 text-sm mt-1">All professors in your college</p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : professors.length === 0 ? (
        <EmptyState icon={Users} title="No professors" description="No professors have registered for your college yet." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {professors.map((prof, idx) => (
            <motion.div key={prof.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold">
                    {getInitials(prof.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-900">{prof.name}</h3>
                    <p className="text-xs text-dark-400">{prof.departmentName || 'No Department'}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-dark-500">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-dark-400" />
                    <span className="truncate">{prof.email}</span>
                  </div>
                  {prof.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-dark-400" />
                      {prof.phone}
                    </div>
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
