import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Megaphone, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import principalAPI from '../../api/principal.api'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import BroadcastCard from '../../components/shared/BroadcastCard'
import EmptyState from '../../components/ui/EmptyState'

const broadcastSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  attachmentUrl: z.string().optional(),
})

export default function PrincipalBroadcastPage() {
  const queryClient = useQueryClient()

  const { data: broadcasts = [] } = useQuery({
    queryKey: ['principal-broadcasts'],
    queryFn: () => principalAPI.getBroadcasts().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const form = useForm({ resolver: zodResolver(broadcastSchema) })

  const createMutation = useMutation({
    mutationFn: (data) => principalAPI.createBroadcast({ ...data, level: 'COLLEGE' }),
    onSuccess: () => { toast.success('Broadcast sent to college!'); queryClient.invalidateQueries({ queryKey: ['principal-broadcasts'] }); form.reset() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-dark-900">College Broadcasts</h1>
        <p className="text-dark-500 text-sm mt-1">Send messages to your college</p>
      </div>

      <Card hover={false}>
        <h2 className="text-lg font-semibold font-heading text-dark-900 mb-4 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary-600" /> New Broadcast
        </h2>
        <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
          <Input label="Title" placeholder="Subject..." error={form.formState.errors.title?.message} {...form.register('title')} />
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Message</label>
            <textarea className="input-field min-h-[120px] resize-y" placeholder="Write your message..." {...form.register('message')} />
            {form.formState.errors.message?.message && <p className="mt-1 text-sm text-red-500">{form.formState.errors.message.message}</p>}
          </div>
          <Input label="Attachment URL (Optional)" placeholder="https://..." {...form.register('attachmentUrl')} />
          <div className="flex justify-end">
            <Button type="submit" icon={Send} iconPosition="right" loading={createMutation.isPending}>Send Broadcast</Button>
          </div>
        </form>
      </Card>

      <div>
        <h2 className="text-lg font-semibold font-heading text-dark-900 mb-4">Sent Broadcasts</h2>
        {broadcasts.length === 0 ? (
          <EmptyState icon={Megaphone} title="No broadcasts" description="You haven't sent any broadcasts yet." />
        ) : (
          <div className="space-y-4">
            {broadcasts.map((b, idx) => <BroadcastCard key={b.id} broadcast={b} delay={idx * 0.05} />)}
          </div>
        )}
      </div>
    </div>
  )
}
