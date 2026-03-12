import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Megaphone, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import hodAPI from '../../api/hod.api'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import BroadcastCard from '../../components/shared/BroadcastCard'
import EmptyState from '../../components/ui/EmptyState'

const broadcastSchema = z.object({
  title: z.string().min(2, 'Title required'),
  message: z.string().min(10, 'Message must be 10+ chars'),
  attachmentUrl: z.string().optional(),
})

export default function HODBroadcastPage() {
  const queryClient = useQueryClient()
  const form = useForm({ resolver: zodResolver(broadcastSchema) })

  const createMutation = useMutation({
    mutationFn: (data) => hodAPI.createBroadcast({ ...data, broadcastLevel: 'DEPARTMENT' }),
    onSuccess: () => { toast.success('Broadcast sent to department!'); queryClient.invalidateQueries({ queryKey: ['hod-broadcasts'] }); form.reset() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-heading text-dark-900">Department Broadcasts</h1><p className="text-dark-500 text-sm mt-1">Send messages to your department</p></div>

      <Card hover={false}>
        <h2 className="text-lg font-semibold font-heading text-dark-900 mb-4 flex items-center gap-2"><Megaphone className="w-5 h-5 text-primary-600" /> New Broadcast</h2>
        <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
          <Input label="Title" placeholder="Subject..." error={form.formState.errors.title?.message} {...form.register('title')} />
          <div><label className="block text-sm font-medium text-dark-700 mb-1.5">Message</label><textarea className="input-field min-h-[120px] resize-y" placeholder="Write your message..." {...form.register('message')} />{form.formState.errors.message?.message && <p className="mt-1 text-sm text-red-500">{form.formState.errors.message.message}</p>}</div>
          <Input label="Attachment URL (Optional)" placeholder="https://..." {...form.register('attachmentUrl')} />
          <div className="flex justify-end"><Button type="submit" icon={Send} iconPosition="right" loading={createMutation.isPending}>Send Broadcast</Button></div>
        </form>
      </Card>

      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 flex items-start gap-3">
        <Megaphone className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
        <div><p className="text-sm font-medium text-teal-800">Department-Level Broadcast</p><p className="text-sm text-teal-600">This message will be sent to all members of your department.</p></div>
      </div>
    </div>
  )
}
