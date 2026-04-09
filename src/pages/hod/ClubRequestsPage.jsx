import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Award, CheckCircle, XCircle, Clock, User, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import hodAPI from '../../api/hod.api'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { CLUB_STATUS_COLORS } from '../../utils/constants'
import { formatEnumLabel } from '../../utils/formatters'

export default function HODClubRequestsPage() {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState('PENDING')

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ['hod-club-requests', status],
    queryFn: () =>
      hodAPI
        .getClubRequests(status === 'PENDING' ? undefined : status)
        .then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const approveMutation = useMutation({
    mutationFn: (id) => hodAPI.approveClub(id),
    onSuccess: () => {
      toast.success('Club approved! Sent to Principal.')
      queryClient.invalidateQueries({ queryKey: ['hod-club-requests'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const rejectMutation = useMutation({
    mutationFn: (id) => hodAPI.rejectClub(id),
    onSuccess: () => {
      toast.success('Club rejected')
      queryClient.invalidateQueries({ queryKey: ['hod-club-requests'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const tabs = [
    { key: 'PENDING', label: 'Pending', icon: Clock },
    { key: 'APPROVED', label: 'Approved', icon: CheckCircle },
    { key: 'REJECTED', label: 'Rejected', icon: XCircle },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-dark-900">Club Requests</h1>
        <p className="text-dark-500 text-sm mt-1">Review club creation requests from students</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-dark-100">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setStatus(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl whitespace-nowrap transition-colors ${
              status === t.key
                ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                : 'text-dark-500 hover:text-dark-700'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : clubs.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No clubs here"
          description={`No club requests with status "${formatEnumLabel(status)}".`}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {clubs.map((club, idx) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <Badge color={CLUB_STATUS_COLORS[club.status]} size="sm" dot>
                    {formatEnumLabel(club.status)}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold font-heading text-dark-900 mb-1">{club.name}</h3>
                <p className="text-sm text-dark-500 mb-3 line-clamp-2">{club.description}</p>
                <div className="space-y-1.5 text-sm text-dark-500 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-dark-400" />
                    Created by: {club.createdByName || 'Student'}
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-dark-400" />
                    Guide: {club.guideName || 'N/A'}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-dark-400 mb-4">
                  <span className="px-2 py-0.5 rounded bg-green-50 text-green-700">✓ Student</span>
                  <span>→</span>
                  <span
                    className={`px-2 py-0.5 rounded ${
                      club.status === 'PENDING_HOD' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                    }`}
                  >
                    {club.status === 'PENDING_HOD' ? '⏳' : '✓'} HOD
                  </span>
                  <span>→</span>
                  <span
                    className={`px-2 py-0.5 rounded ${
                      ['APPROVED', 'REJECTED'].includes(club.status)
                        ? club.status === 'APPROVED'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {club.status === 'APPROVED' ? '✓' : club.status === 'REJECTED' ? '✗' : '⏳'} Principal
                  </span>
                </div>

                {status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      icon={CheckCircle}
                      onClick={() => approveMutation.mutate(club.id)}
                      loading={approveMutation.isPending}
                      className="flex-1"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={XCircle}
                      onClick={() => rejectMutation.mutate(club.id)}
                      loading={rejectMutation.isPending}
                      className="flex-1"
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
