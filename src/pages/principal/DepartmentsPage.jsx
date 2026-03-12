import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { School, Plus, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import principalAPI from '../../api/principal.api'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import EmptyState from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'

const deptSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  code: z.string().min(2, 'Code is required'),
})

const hodSchema = z.object({
  hodId: z.string().min(1, 'Please enter a professor ID'),
})

export default function DepartmentsPage() {
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedDept, setSelectedDept] = useState(null)

  const { data: departments = [], isLoading } = useQuery({
    queryKey: ['principal-departments'],
    queryFn: () => principalAPI.getDepartments().then((r) => (Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])),
  })

  const createForm = useForm({ resolver: zodResolver(deptSchema) })
  const hodForm = useForm({ resolver: zodResolver(hodSchema) })

  const createMutation = useMutation({
    mutationFn: (data) => principalAPI.createDepartment(data),
    onSuccess: () => {
      toast.success('Department created!')
      queryClient.invalidateQueries({ queryKey: ['principal-departments'] })
      setCreateOpen(false)
      createForm.reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create department'),
  })

  const assignMutation = useMutation({
    mutationFn: ({ id, data }) => principalAPI.assignHOD(id, data),
    onSuccess: () => {
      toast.success('HOD assigned successfully!')
      queryClient.invalidateQueries({ queryKey: ['principal-departments'] })
      setAssignOpen(false)
      hodForm.reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to assign HOD'),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-dark-900">Departments</h1>
          <p className="text-dark-500 text-sm mt-1">Manage your college departments</p>
        </div>
        <Button icon={Plus} onClick={() => setCreateOpen(true)}>Create Department</Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : departments.length === 0 ? (
        <EmptyState icon={School} title="No departments" description="Create your first department." action={<Button icon={Plus} onClick={() => setCreateOpen(true)}>Create Department</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, idx) => (
            <motion.div key={dept.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                    <School className="w-5 h-5 text-blue-600" />
                  </div>
                  <Badge color="blue" size="sm">{dept.code}</Badge>
                </div>
                <h3 className="text-lg font-semibold font-heading text-dark-900 mb-2">{dept.name}</h3>
                <p className="text-sm text-dark-500 mb-4">
                  <span className="font-medium">HOD:</span>{' '}
                  {dept.hodName || <span className="text-dark-400 italic">Not Assigned</span>}
                </p>
                <Button variant="secondary" size="sm" icon={UserPlus} className="w-full" onClick={() => { setSelectedDept(dept); setAssignOpen(true) }}>
                  {dept.hodName ? 'Change HOD' : 'Assign HOD'}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={createOpen} onClose={() => { setCreateOpen(false); createForm.reset() }} title="Create Department" footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={createForm.handleSubmit((d) => createMutation.mutate(d))} loading={createMutation.isPending}>Create</Button></>}>
        <form className="space-y-4">
          <Input label="Department Name" placeholder="e.g. Computer Science" error={createForm.formState.errors.name?.message} {...createForm.register('name')} />
          <Input label="Department Code" placeholder="e.g. CSE" error={createForm.formState.errors.code?.message} {...createForm.register('code')} />
        </form>
      </Modal>

      <Modal isOpen={assignOpen} onClose={() => { setAssignOpen(false); hodForm.reset() }} title={`Assign HOD — ${selectedDept?.name || ''}`} size="sm" footer={<><Button variant="secondary" onClick={() => setAssignOpen(false)}>Cancel</Button><Button onClick={hodForm.handleSubmit((d) => assignMutation.mutate({ id: selectedDept?.id, data: d }))} loading={assignMutation.isPending}>Assign</Button></>}>
        <form className="space-y-4">
          <Input label="Professor User ID" placeholder="Enter professor's user ID" error={hodForm.formState.errors.hodId?.message} {...hodForm.register('hodId')} />
          <p className="text-xs text-dark-400">This professor will be assigned as the Head of Department.</p>
        </form>
      </Modal>
    </div>
  )
}
