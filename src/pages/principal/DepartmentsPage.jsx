import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { School, Plus, UserPlus, Search, User, X } from 'lucide-react'
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

export default function DepartmentsPage() {
  const queryClient = useQueryClient()

  // Modal state
  const [createOpen, setCreateOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedDept, setSelectedDept] = useState(null)

  // Search state inside assign modal
  const [userQuery, setUserQuery] = useState('')
  const [userResults, setUserResults] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchError, setSearchError] = useState('')

  // ─── Data ────────────────────────────────────────────────────────────────────

  const { data: departments = [], isLoading } = useQuery({
    queryKey: ['principal-departments'],
    queryFn: () =>
      principalAPI.getDepartments().then((r) =>
        Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : []
      ),
  })

  // Fetch professors only when assign modal is open
  const { data: professors = [], isLoading: professorsLoading } = useQuery({
    queryKey: ['principal-professors'],
    queryFn: () =>
      principalAPI.getProfessors().then((r) =>
        Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : []
      ),
    enabled: assignOpen, // only fetch when modal is open
  })

  const createForm = useForm({ resolver: zodResolver(deptSchema) })

  // ─── Mutations ───────────────────────────────────────────────────────────────

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
      closeAssignModal()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to assign HOD'),
  })

  // ─── Professor Search (local filter from fetched list) ────────────────────────

  const handleUserSearch = () => {
    if (!userQuery.trim()) return
    setSearchError('')

    const lowerQuery = userQuery.toLowerCase()
    const list = professors.filter(
      (p) =>
        p.name?.toLowerCase().includes(lowerQuery) ||
        p.email?.toLowerCase().includes(lowerQuery) ||
        p.phone?.toLowerCase().includes(lowerQuery)
    )

    setUserResults(list)
    if (list.length === 0) setSearchError('No professors found. Try a different search.')
  }

  const handleAssignSubmit = () => {
    if (!selectedUser) {
      toast.error('Please search and select a professor first.')
      return
    }
    assignMutation.mutate({
      id: selectedDept?.id,
      data: { userId: selectedUser.id },
    })
  }

  const closeAssignModal = () => {
    setAssignOpen(false)
    setSelectedDept(null)
    setUserQuery('')
    setUserResults([])
    setSelectedUser(null)
    setSearchError('')
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

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
        <EmptyState
          icon={School}
          title="No departments"
          description="Create your first department."
          action={<Button icon={Plus} onClick={() => setCreateOpen(true)}>Create Department</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, idx) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
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
                <Button
                  variant="secondary"
                  size="sm"
                  icon={UserPlus}
                  className="w-full"
                  onClick={() => {
                    setSelectedDept(dept)
                    setAssignOpen(true)
                  }}
                >
                  {dept.hodName ? 'Change HOD' : 'Assign HOD'}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Create Department Modal ─────────────────────────────────────────────── */}
      <Modal
        isOpen={createOpen}
        onClose={() => { setCreateOpen(false); createForm.reset() }}
        title="Create Department"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button
              onClick={createForm.handleSubmit((d) => createMutation.mutate(d))}
              loading={createMutation.isPending}
            >
              Create
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Department Name"
            placeholder="e.g. Computer Science"
            error={createForm.formState.errors.name?.message}
            {...createForm.register('name')}
          />
          <Input
            label="Department Code"
            placeholder="e.g. CSE"
            error={createForm.formState.errors.code?.message}
            {...createForm.register('code')}
          />
        </form>
      </Modal>

      {/* ── Assign HOD Modal ────────────────────────────────────────────────────── */}
      <Modal
        isOpen={assignOpen}
        onClose={closeAssignModal}
        title={`Assign HOD — ${selectedDept?.name || ''}`}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={closeAssignModal}>Cancel</Button>
            <Button
              onClick={handleAssignSubmit}
              loading={assignMutation.isPending}
              disabled={!selectedUser}
            >
              Assign HOD
            </Button>
          </>
        }
      >
        <div className="space-y-4">

          {/* Loading state while professors are being fetched */}
          {professorsLoading ? (
            <div className="flex items-center justify-center py-8 text-dark-400 text-sm gap-2">
              <svg className="animate-spin w-4 h-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Loading professors...
            </div>
          ) : (
            <>
              {/* Search bar */}
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Search Professor
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email or phone..."
                      value={userQuery}
                      onChange={(e) => {
                        setUserQuery(e.target.value)
                        setUserResults([])
                        setSelectedUser(null)
                        setSearchError('')
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleUserSearch()}
                      className="input-field pl-10 w-full"
                    />
                  </div>
                  <Button
                    onClick={handleUserSearch}
                    disabled={!userQuery.trim()}
                    size="sm"
                  >
                    Search
                  </Button>
                </div>
                <p className="text-xs text-dark-400 mt-1">
                  {professors.length > 0
                    ? `${professors.length} professor(s) available — type a name, email or phone and press Search.`
                    : 'No professors found in this college.'}
                </p>
              </div>

              {/* Error message */}
              {searchError && (
                <p className="text-sm text-red-500">{searchError}</p>
              )}

              {/* Search results list */}
              {userResults.length > 0 && !selectedUser && (
                <div className="border border-dark-200 rounded-lg overflow-hidden divide-y divide-dark-100 max-h-[300px] overflow-y-auto">
                  {userResults.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setSelectedUser(u)
                        setUserResults([])
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 text-left transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark-900 truncate">{u.name}</p>
                        <p className="text-xs text-dark-400 truncate">{u.email}</p>
                        {u.phone && (
                          <p className="text-xs text-dark-400">{u.phone}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected user card */}
              {selectedUser && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark-900">{selectedUser.name}</p>
                    <p className="text-xs text-dark-500">{selectedUser.email}</p>
                    {selectedUser.phone && (
                      <p className="text-xs text-dark-400">{selectedUser.phone}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUser(null)
                      setUserQuery('')
                    }}
                    className="p-1 rounded hover:bg-blue-200 text-dark-400 hover:text-dark-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}