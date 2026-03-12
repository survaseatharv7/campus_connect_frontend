import { useQuery } from '@tanstack/react-query'
import { Megaphone } from 'lucide-react'
import studentAPI from '../../api/student.api'
import BroadcastCard from '../../components/shared/BroadcastCard'
import EmptyState from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'

export default function StudentBroadcastPage() {
  const { data: broadcasts = [], isLoading } = useQuery({
    queryKey: ['student-broadcasts'],
    queryFn: () => studentAPI.getBroadcasts().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-heading text-dark-900">Broadcasts</h1><p className="text-dark-500 text-sm mt-1">Important announcements from your college</p></div>

      {isLoading ? (
        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : broadcasts.length === 0 ? (
        <EmptyState icon={Megaphone} title="No broadcasts" description="No announcements available right now." />
      ) : (
        <div className="space-y-4">
          {broadcasts.map((b, idx) => <BroadcastCard key={b.id} broadcast={b} delay={idx * 0.05} />)}
        </div>
      )}
    </div>
  )
}
