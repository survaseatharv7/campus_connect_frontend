import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Megaphone, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import adminAPI from '../../api/admin.api'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import EmptyState from '../../components/ui/EmptyState'
import BroadcastCard from '../../components/shared/BroadcastCard'

const broadcastSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  attachmentUrl: z.string().optional(),
})

export default function AdminBroadcastPage() {
  const queryClient = useQueryClient()

  const form = useForm({ resolver: zodResolver(broadcastSchema) })

  const createMutation = useMutation({
    mutationFn: (data) =>
      adminAPI.createBroadcast({ ...data, level: 'CAMPUS' }),
    onSuccess: () => {
      toast.success('Broadcast sent to entire campus!')
      queryClient.invalidateQueries({ queryKey: ['admin-broadcasts'] })
      form.reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to send broadcast'),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-dark-900">Campus Broadcasts</h1>
        <p className="text-dark-500 text-sm mt-1">Send messages to the entire campus</p>
      </div>

      {/* Compose Section */}
      <Card hover={false}>
        <h2 className="text-lg font-semibold font-heading text-dark-900 mb-4 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary-600" />
          New Broadcast
        </h2>
        <form
          onSubmit={form.handleSubmit((data) => createMutation.mutate(data))}
          className="space-y-4"
        >
          <Input
            label="Title"
            placeholder="Broadcast subject..."
            error={form.formState.errors.title?.message}
            {...form.register('title')}
          />
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Message</label>
            <textarea
              className="input-field min-h-[120px] resize-y"
              placeholder="Write your broadcast message..."
              {...form.register('message')}
            />
            {form.formState.errors.message?.message && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.message.message}
              </p>
            )}
          </div>
          <Input
            label="Attachment URL (Optional)"
            placeholder="https://..."
            {...form.register('attachmentUrl')}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              icon={Send}
              iconPosition="right"
              loading={createMutation.isPending}
            >
              Send Broadcast
            </Button>
          </div>
        </form>
      </Card>

      {/* Info banner */}
      <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 flex items-start gap-3">
        <Megaphone className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-primary-800">Campus-Level Broadcast</p>
          <p className="text-sm text-primary-600">
            This message will be sent to all users across all colleges on the platform.
          </p>
        </div>
      </div>
    </div>
  )
}
