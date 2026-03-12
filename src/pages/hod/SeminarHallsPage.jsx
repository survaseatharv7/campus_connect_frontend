import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DoorOpen, Plus, Users, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import hodAPI from '../../api/hod.api'
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

export default function HODSeminarHallsPage() {
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)

  const { data: halls = [], isLoading } = useQuery({
    queryKey: ['hod-seminar-halls'],
    queryFn: () => hodAPI.getSeminarHalls().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const form = useForm({ resolver: zodResolver(hallSchema) })

  const createMutation = useMutation({
    mutationFn: (data) => hodAPI.createSeminarHall({ ...data, capacity: parseInt(data.capacity), hallType: 'DEPARTMENT' }),
    onSuccess: () => { toast.success('Department seminar hall created!'); queryClient.invalidateQueries({ queryKey: ['hod-seminar-halls'] }); setCreateOpen(false); form.reset() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold font-heading text-dark-900">Department Seminar Halls</h1><p className="text-dark-500 text-sm mt-1">Manage department-level seminar halls</p></div>
        <Button icon={Plus} onClick={() => setCreateOpen(true)}>Create Hall</Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : halls.length === 0 ? (
        <EmptyState icon={DoorOpen} title="No seminar halls" description="Create your first department seminar hall." action={<Button icon={Plus} onClick={() => setCreateOpen(true)}>Create Hall</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.map((hall, idx) => (
            <Card key={hall.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center"><DoorOpen className="w-5 h-5 text-purple-600" /></div>
                <Badge color={HALL_STATUS_COLORS[hall.status] || 'gray'} size="sm" dot>{formatEnumLabel(hall.status || 'AVAILABLE')}</Badge>
              </div>
              <h3 className="text-lg font-semibold font-heading text-dark-900 mb-2">{hall.name}</h3>
              <div className="space-y-1.5 text-sm text-dark-500">
                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-dark-400" />Capacity: {hall.capacity}</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-dark-400" />{hall.location}</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={createOpen} onClose={() => { setCreateOpen(false); form.reset() }} title="Create Department Seminar Hall" footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={form.handleSubmit((d) => createMutation.mutate(d))} loading={createMutation.isPending}>Create</Button></>}>
        <form className="space-y-4">
          <Input label="Hall Name" placeholder="e.g. CS Lab 1" error={form.formState.errors.name?.message} {...form.register('name')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Capacity" type="number" placeholder="50" error={form.formState.errors.capacity?.message} {...form.register('capacity')} />
            <Input label="Location" placeholder="Block C" error={form.formState.errors.location?.message} {...form.register('location')} />
          </div>
          <div><label className="block text-sm font-medium text-dark-700 mb-1.5">Facilities</label><textarea className="input-field min-h-[80px] resize-y" placeholder="Items..." {...form.register('facilities')} /></div>
        </form>
      </Modal>
    </div>
  )
}
