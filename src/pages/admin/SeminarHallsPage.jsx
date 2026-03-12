import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DoorOpen, Plus, Users, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import adminAPI from '../../api/admin.api'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import EmptyState from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { HALL_STATUS_COLORS } from '../../utils/constants'
import { formatEnumLabel } from '../../utils/formatters'

const hallSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  capacity: z.string().min(1, 'Capacity is required'),
  location: z.string().min(2, 'Location is required'),
  facilities: z.string().optional(),
})

export default function AdminSeminarHallsPage() {
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)

  const { data: halls = [], isLoading } = useQuery({
    queryKey: ['admin-seminar-halls'],
    queryFn: () => adminAPI.getSeminarHalls().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const form = useForm({ resolver: zodResolver(hallSchema) })

  const createMutation = useMutation({
    mutationFn: (data) =>
      adminAPI.createSeminarHall({
        ...data,
        capacity: parseInt(data.capacity),
        hallType: 'PUBLIC',
      }),
    onSuccess: () => {
      toast.success('Public seminar hall created!')
      queryClient.invalidateQueries({ queryKey: ['admin-seminar-halls'] })
      setCreateOpen(false)
      form.reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create hall'),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-dark-900">Public Seminar Halls</h1>
          <p className="text-dark-500 text-sm mt-1">Manage campus-wide public seminar halls</p>
        </div>
        <Button icon={Plus} onClick={() => setCreateOpen(true)}>
          Create Hall
        </Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : halls.length === 0 ? (
        <EmptyState
          icon={DoorOpen}
          title="No seminar halls"
          description="Create your first public seminar hall."
          action={
            <Button icon={Plus} onClick={() => setCreateOpen(true)}>
              Create Hall
            </Button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.map((hall, idx) => (
            <motion.div
              key={hall.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                    <DoorOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <Badge color={HALL_STATUS_COLORS[hall.status] || 'gray'} size="sm" dot>
                    {formatEnumLabel(hall.status || 'AVAILABLE')}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold font-heading text-dark-900 mb-2">
                  {hall.name}
                </h3>
                <div className="space-y-1.5 text-sm text-dark-500">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-dark-400" />
                    Capacity: {hall.capacity}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-dark-400" />
                    {hall.location}
                  </div>
                </div>
                {hall.facilities && (
                  <p className="text-xs text-dark-400 mt-3">{hall.facilities}</p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={createOpen}
        onClose={() => {
          setCreateOpen(false)
          form.reset()
        }}
        title="Create Public Seminar Hall"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit((data) => createMutation.mutate(data))}
              loading={createMutation.isPending}
            >
              Create Hall
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Hall Name"
            placeholder="e.g. Main Auditorium"
            error={form.formState.errors.name?.message}
            {...form.register('name')}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Capacity"
              type="number"
              placeholder="e.g. 500"
              error={form.formState.errors.capacity?.message}
              {...form.register('capacity')}
            />
            <Input
              label="Location"
              placeholder="e.g. Block A"
              error={form.formState.errors.location?.message}
              {...form.register('location')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">
              Facilities (Optional)
            </label>
            <textarea
              className="input-field min-h-[80px] resize-y"
              placeholder="e.g. Projector, Mic, AC..."
              {...form.register('facilities')}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}
