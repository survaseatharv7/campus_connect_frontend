import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Award, Plus, Users, User, BookOpen, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import studentAPI from '../../api/student.api'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import SearchSelect from '../../components/ui/SearchSelect'
import EmptyState from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { Controller } from 'react-hook-form'
import useAuthStore from '../../store/authStore'
import { CLUB_STATUS_COLORS } from '../../utils/constants'
import { formatEnumLabel } from '../../utils/formatters'

const clubSchema = z.object({
  name: z.string().min(2, 'Name required'),
  description: z.string().min(10, 'Description must be 10+ chars'),
  guideTeacherId: z.string().min(1, 'Guide teacher selection is required'),
})

export default function StudentClubsPage() {
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [tab, setTab] = useState('my')

  const user = useAuthStore((state) => state.user)

  const { data: allClubs = [], isLoading } = useQuery({
    queryKey: ['student-all-clubs'],
    queryFn: () => studentAPI.getAllClubs().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const { data: professors = [], isLoading: loadingProfs } = useQuery({
    queryKey: ['student-professors'],
    queryFn: () => studentAPI.getProfessors().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const myClubs = allClubs.filter((c) => c.isMember || c.isOwner)
  const browseClubs = allClubs.filter((c) => c.status === 'APPROVED' && !c.isMember && !c.isOwner)

  const form = useForm({ resolver: zodResolver(clubSchema) })

  const createMutation = useMutation({
    mutationFn: (data) => studentAPI.createClub(data),
    onSuccess: () => { toast.success('Club request submitted!'); queryClient.invalidateQueries({ queryKey: ['student-clubs'] }); setCreateOpen(false); form.reset() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const joinMutation = useMutation({
    mutationFn: (clubId) => studentAPI.joinClub(clubId),
    onSuccess: () => { toast.success('Joined club!'); queryClient.invalidateQueries({ queryKey: ['student-clubs', 'student-all-clubs'] }) },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to join'),
  })

  const renderCardActions = (club) => {
    if (club.isOwner) {
      return (
        <div className="mt-4">
          <Button variant="primary" size="sm" className="w-full bg-dark-900 hover:bg-dark-800 text-white border-0 text-sm">
            Manage / Dashboard
          </Button>
        </div>
      )
    }

    if (club.isMember) {
      return (
        <div className="mt-4">
          <Button variant="success" size="sm" disabled className="w-full text-sm">
            ✓ Joined
          </Button>
        </div>
      )
    }

    return (
      <div className="mt-4">
        <Button 
          variant="primary" 
          size="sm" 
          className="w-full text-sm" 
          onClick={() => joinMutation.mutate(club.id)} 
          loading={joinMutation.isPending && joinMutation.variables === club.id}
        >
          Join Club
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold font-heading text-dark-900">Clubs</h1><p className="text-dark-500 text-sm mt-1">Create or join student clubs</p></div>
        <Button icon={Plus} onClick={() => setCreateOpen(true)}>Create Club</Button>
      </div>

      <div className="flex gap-2 border-b border-dark-100 pb-1">
        <button onClick={() => setTab('my')} className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors ${tab === 'my' ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600' : 'text-dark-500 hover:text-dark-700'}`}>
          My Clubs ({myClubs.length})
        </button>
        <button onClick={() => setTab('all')} className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors ${tab === 'all' ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600' : 'text-dark-500 hover:text-dark-700'}`}>
          Browse Clubs ({browseClubs.length})
        </button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : tab === 'my' ? (
        myClubs.length === 0 ? (
          <EmptyState icon={Award} title="No clubs yet" description="Create a new club or browse existing ones." action={<Button icon={Plus} onClick={() => setCreateOpen(true)}>Create Club</Button>} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myClubs.map((club, idx) => (
              <motion.div key={club.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <Card>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center"><Award className="w-5 h-5 text-amber-600" /></div>
                    <Badge color={CLUB_STATUS_COLORS[club.status]} size="sm" dot>{formatEnumLabel(club.status)}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold font-heading text-dark-900 mb-1">{club.name}</h3>
                  <p className="text-sm text-dark-500 mb-3 line-clamp-2">{club.description}</p>
                  <div className="text-sm text-dark-500 flex items-center gap-2">
                    <Users className="w-4 h-4 text-dark-400" />{club.memberCount || 0} members
                  </div>
                  {renderCardActions(club)}
                </Card>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        browseClubs.length === 0 ? (
          <EmptyState icon={Award} title="No clubs available" description="No new approved clubs to join right now." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {browseClubs.map((club, idx) => (
              <motion.div key={club.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <Card>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center"><Award className="w-5 h-5 text-amber-600" /></div>
                    <Badge color="green" size="sm">Approved</Badge>
                  </div>
                  <h3 className="text-lg font-semibold font-heading text-dark-900 mb-1">{club.name}</h3>
                  <p className="text-sm text-dark-500 mb-3 line-clamp-2">{club.description}</p>
                  <div className="flex items-center gap-2 text-sm text-dark-500">
                    <BookOpen className="w-4 h-4 text-dark-400" />Guide: {club.guideName || 'TBA'}
                  </div>
                  {renderCardActions(club)}
                </Card>
              </motion.div>
            ))}
          </div>
        )
      )}

      <Modal isOpen={createOpen} onClose={() => { setCreateOpen(false); form.reset() }} title="Create New Club" footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={form.handleSubmit((d) => createMutation.mutate(d))} loading={createMutation.isPending}>Submit Request</Button></>}>
        <form className="space-y-4">
          <Input label="Club Name" placeholder="e.g. Robotics Club" error={form.formState.errors.name?.message} {...form.register('name')} />
          <div><label className="block text-sm font-medium text-dark-700 mb-1.5">Description</label><textarea className="input-field min-h-[100px] resize-y" placeholder="Describe your club..." {...form.register('description')} />{form.formState.errors.description?.message && <p className="mt-1 text-sm text-red-500">{form.formState.errors.description.message}</p>}</div>
          
          <Controller
            name="guideTeacherId"
            control={form.control}
            render={({ field }) => (
              <SearchSelect
                label="Guide Teacher"
                placeholder="Search by professor name..."
                options={professors}
                value={field.value}
                onChange={field.onChange}
                isLoading={loadingProfs}
                error={form.formState.errors.guideTeacherId?.message}
              />
            )}
          />

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <p className="text-sm text-amber-800">Your club request will go through HOD → Principal approval.</p>
          </div>
        </form>
      </Modal>
    </div>
  )
}
