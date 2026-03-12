import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Building2, Plus, Search, CheckCircle, UserPlus, MapPin, User, X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import adminAPI from '../../api/admin.api'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import EmptyState from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { COLLEGE_STATUS_COLORS } from '../../utils/constants'
import { formatEnumLabel } from '../../utils/formatters'

const createSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  logoUrl: z.string().optional(),
})

export default function CollegesPage() {
  const queryClient = useQueryClient()

  // Modal state
  const [createOpen, setCreateOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedCollege, setSelectedCollege] = useState(null)

  // College list filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // User search state (inside assign modal)
  const [userQuery, setUserQuery] = useState('')
  const [userResults, setUserResults] = useState([])
  const [userSearchLoading, setUserSearchLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchError, setSearchError] = useState('')

  // ─── Data ────────────────────────────────────────────────────────────────────

  const { data: colleges = [], isLoading } = useQuery({
    queryKey: ['admin-colleges'],
    queryFn: () =>
      adminAPI.getColleges().then((r) =>
        Array.isArray(r.data.data) ? r.data.data : Array.isArray(r.data) ? r.data : []
      ),
  })

  const createForm = useForm({ resolver: zodResolver(createSchema) })

  // ─── Mutations ───────────────────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: (data) => adminAPI.createCollege(data),
    onSuccess: () => {
      toast.success('College created successfully!')
      queryClient.invalidateQueries({ queryKey: ['admin-colleges'] })
      setCreateOpen(false)
      createForm.reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create college'),
  })

  const approveMutation = useMutation({
    mutationFn: (id) => adminAPI.approveCollege(id),
    onSuccess: () => {
      toast.success('College approved!')
      queryClient.invalidateQueries({ queryKey: ['admin-colleges'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to approve'),
  })

  const assignMutation = useMutation({
    mutationFn: ({ id, data }) => adminAPI.assignPrincipal(id, data),
    onSuccess: () => {
      toast.success('Principal assigned!')
      queryClient.invalidateQueries({ queryKey: ['admin-colleges'] })
      closeAssignModal()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to assign principal'),
  })

  // ─── User Search ─────────────────────────────────────────────────────────────

  const handleUserSearch = useCallback(async () => {
    if (!userQuery.trim()) return
    setUserSearchLoading(true)
    setSearchError('')
    setUserResults([])
    try {
      const res = await adminAPI.searchUsers(userQuery.trim())
      const list = res.data?.data ?? []
      setUserResults(list)
      if (list.length === 0) setSearchError('No users found. Try a different search.')
    } catch {
      setSearchError('Search failed. Please try again.')
    } finally {
      setUserSearchLoading(false)
    }
  }, [userQuery])

  const handleAssignSubmit = () => {
    if (!selectedUser) {
      toast.error('Please search and select a user first.')
      return
    }
    assignMutation.mutate({
      id: selectedCollege?.id,
      data: { userEmail: selectedUser.email },
    })
  }

  const closeAssignModal = () => {
    setAssignOpen(false)
    setSelectedCollege(null)
    setUserQuery('')
    setUserResults([])
    setSelectedUser(null)
    setSearchError('')
  }

  // ─── Filtering ───────────────────────────────────────────────────────────────

  const filtered = colleges.filter((c) => {
    const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-dark-900">Colleges</h1>
          <p className="text-dark-500 text-sm mt-1">Manage all colleges on the platform</p>
        </div>
        <Button icon={Plus} onClick={() => setCreateOpen(true)}>
          Create College
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input
            type="text"
            placeholder="Search colleges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-auto min-w-[150px]"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* College Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No colleges found"
          description={
            searchTerm
              ? 'Try adjusting your search filters.'
              : 'Create your first college to get started.'
          }
          action={
            !searchTerm && (
              <Button icon={Plus} onClick={() => setCreateOpen(true)}>
                Create College
              </Button>
            )
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((college, idx) => (
            <motion.div
              key={college.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-0 overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-primary-600 to-primary-800 relative">
                  <div className="absolute -bottom-6 left-5">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge color={COLLEGE_STATUS_COLORS[college.status]} variant="solid" size="sm">
                      {formatEnumLabel(college.status)}
                    </Badge>
                  </div>
                </div>
                <div className="p-5 pt-10">
                  <h3 className="text-lg font-semibold font-heading text-dark-900 mb-1">
                    {college.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-dark-400 mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {college.city}, {college.state}
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <code className="text-xs bg-dark-50 px-2 py-0.5 rounded text-dark-600">
                      {college.uniqueCode}
                    </code>
                  </div>
                  <div className="text-sm text-dark-500 mb-4">
                    <span className="font-medium">Principal:</span>{' '}
                    {college.principalName || (
                      <span className="text-dark-400 italic">Not Assigned</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {college.status === 'PENDING' && (
                      <Button
                        variant="success"
                        size="sm"
                        icon={CheckCircle}
                        onClick={() => approveMutation.mutate(college.id)}
                        loading={approveMutation.isPending}
                        className="flex-1"
                      >
                        Approve
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={UserPlus}
                      onClick={() => {
                        setSelectedCollege(college)
                        setAssignOpen(true)
                      }}
                      className="flex-1"
                    >
                      Assign Principal
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Create College Modal ────────────────────────────────────────────────── */}
      <Modal
        isOpen={createOpen}
        onClose={() => { setCreateOpen(false); createForm.reset() }}
        title="Create New College"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button
              onClick={createForm.handleSubmit((data) => createMutation.mutate(data))}
              loading={createMutation.isPending}
            >
              Create College
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="College Name"
            placeholder="e.g. MIT College of Engineering"
            error={createForm.formState.errors.name?.message}
            {...createForm.register('name')}
          />
          <Input
            label="Address"
            placeholder="Full address"
            error={createForm.formState.errors.address?.message}
            {...createForm.register('address')}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              placeholder="e.g. Pune"
              error={createForm.formState.errors.city?.message}
              {...createForm.register('city')}
            />
            <Input
              label="State"
              placeholder="e.g. Maharashtra"
              error={createForm.formState.errors.state?.message}
              {...createForm.register('state')}
            />
          </div>
          <Input
            label="Logo URL (Optional)"
            placeholder="https://..."
            {...createForm.register('logoUrl')}
          />
        </form>
      </Modal>

      {/* ── Assign Principal Modal ──────────────────────────────────────────────── */}
      <Modal
        isOpen={assignOpen}
        onClose={closeAssignModal}
        title={`Assign Principal — ${selectedCollege?.name || ''}`}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={closeAssignModal}>Cancel</Button>
            <Button
              onClick={handleAssignSubmit}
              loading={assignMutation.isPending}
              disabled={!selectedUser}
            >
              Assign Principal
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Search bar */}
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">
              Search User
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
                loading={userSearchLoading}
                disabled={!userQuery.trim()}
                size="sm"
              >
                Search
              </Button>
            </div>
            <p className="text-xs text-dark-400 mt-1">
              Type a name, email address, or phone number and press Search.
            </p>
          </div>

          {/* Error message */}
          {searchError && (
            <p className="text-sm text-red-500">{searchError}</p>
          )}

          {/* Search results list */}
          {userResults.length > 0 && !selectedUser && (
            <div className="border border-dark-200 rounded-lg overflow-hidden divide-y divide-dark-100">
              {userResults.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    setSelectedUser(u)
                    setUserResults([])
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-50 text-left transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-900 truncate">{u.name}</p>
                    <p className="text-xs text-dark-400 truncate">{u.email}</p>
                    {u.phone && (
                      <p className="text-xs text-dark-400">{u.phone}</p>
                    )}
                  </div>
                  {u.role && (
                    <Badge color="blue" size="sm">{formatEnumLabel(u.role)}</Badge>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Selected user card */}
          {selectedUser && (
            <div className="flex items-center gap-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary-600" />
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
                className="p-1 rounded hover:bg-primary-100 text-dark-400 hover:text-dark-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}