import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Modal from '../ui/Modal'
import { formatEnumLabel } from '../../utils/formatters'
import Badge from '../ui/Badge'
import { EVENT_STATUS_COLORS } from '../../utils/constants'
import useAuthStore from '../../store/authStore'

export default function EventManagementModal({ isOpen, onClose, event, isCreator = true, fetchParticipants, updateStatus, studentRegistrations = [] }) {
  const queryClient = useQueryClient()
  const eventId = event?.id

  const { user } = useAuthStore()
  const isStudent = user?.role === "STUDENT"

  // FETCH PARTICIPANTS
  const { data: participantsResponse, isLoading } = useQuery({
    queryKey: ['event-participants', eventId],
    queryFn: () => fetchParticipants(eventId),
    enabled: !!eventId && isOpen && !!fetchParticipants && !isStudent
  })
  
  const participants = participantsResponse?.data?.data || participantsResponse?.data || []

  const [currentStatus, setCurrentStatus] = useState(event?.status || 'UPCOMING')

  useEffect(() => {
    if (event) setCurrentStatus(event.status)
  }, [event])

  // UPDATE STATUS
  const mutation = useMutation({
    mutationFn: (status) => updateStatus(eventId, status),
    onMutate: async (newStatus) => {
      setCurrentStatus(newStatus)
      await queryClient.cancelQueries({ queryKey: ['admin-events'] })
      await queryClient.cancelQueries({ queryKey: ['prof-events'] })
      await queryClient.cancelQueries({ queryKey: ['student-events'] })

      const previousAdmin = queryClient.getQueryData(['admin-events'])
      const previousProf = queryClient.getQueryData(['prof-events'])
      const previousStudent = queryClient.getQueryData(['student-events'])

      const updateData = (old) => old ? old.map(e => e.id === eventId ? { ...e, status: newStatus } : e) : old

      queryClient.setQueryData(['admin-events'], updateData)
      queryClient.setQueryData(['prof-events'], updateData)
      queryClient.setQueryData(['student-events'], updateData)

      return { previousAdmin, previousProf, previousStudent }
    },
    onError: (err, newStatus, context) => {
      if (context?.previousAdmin) queryClient.setQueryData(['admin-events'], context.previousAdmin)
      if (context?.previousProf) queryClient.setQueryData(['prof-events'], context.previousProf)
      if (context?.previousStudent) queryClient.setQueryData(['student-events'], context.previousStudent)
      setCurrentStatus(event?.status || 'UPCOMING')
    },
    onSuccess: () => {
      console.log("Invalidating queries after status update")
      queryClient.invalidateQueries({ queryKey: ['admin-events'] })
      queryClient.invalidateQueries({ queryKey: ['prof-events'] })
      queryClient.invalidateQueries({ queryKey: ['student-events'] })
      queryClient.invalidateQueries({ queryKey: ['event-details'] })
    }
  })

  if (!event) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Event Management"
      size="xl"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-dark-50 p-4 rounded-xl border border-dark-100 gap-4">
          <div>
            <h3 className="font-semibold text-dark-900">{event.title}</h3>
            <p className="text-sm text-dark-500">Manage event details and participants</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge color={EVENT_STATUS_COLORS[currentStatus] || 'gray'} variant="solid">
              {currentStatus ? formatEnumLabel(currentStatus) : 'UNKNOWN'}
            </Badge>
            
            {!isStudent && (
              <select 
                className="input-field py-1.5 px-3 w-auto min-w-[140px] text-sm"
                value={currentStatus}
                onChange={(e) => mutation.mutate(e.target.value)}
                disabled={!isCreator || mutation.isPending}
              >
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            )}
          </div>
        </div>

        {studentRegistrations?.find(r => r.eventId === eventId) && (
          <div className="border border-dark-100 p-4 rounded-xl bg-primary-50/50">
            <h4 className="font-semibold text-dark-900 mb-2">Your Registration</h4>
            {(() => {
              const myRegistration = studentRegistrations.find(r => r.eventId === eventId);
              return (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-dark-500">Ticket Code:</span>
                    <p className="font-mono font-medium">{myRegistration.ticketCode}</p>
                  </div>
                  <div>
                    <span className="text-dark-500">Status:</span>
                    <p>
                      <Badge color={myRegistration.ticketStatus === 'CONFIRMED' || myRegistration.ticketStatus === 'VALID' ? 'green' : 'gray'} size="sm">
                        {myRegistration.ticketStatus}
                      </Badge>
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        <div>
           <h4 className="font-semibold text-dark-900 mb-2">Participants</h4>
           <div className="mb-4 text-sm text-dark-600">
             Total Participants: {event.participantCount || event.registeredCount || 0}
           </div>

           {isStudent ? (
             <p className="text-yellow-600 font-medium">
               You are not allowed to view all participants
             </p>
           ) : (
             <div className="overflow-x-auto rounded-xl border border-dark-100">
               <table className="w-full text-sm text-left align-middle whitespace-nowrap">
               <thead className="bg-dark-50 text-dark-500 font-medium border-b border-dark-100">
                 <tr>
                   <th className="px-4 py-3">Name</th>
                   <th className="px-4 py-3">Email</th>
                   <th className="px-4 py-3">Ticket Code</th>
                   <th className="px-4 py-3">Status</th>
                   <th className="px-4 py-3">Payment</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-dark-100">
                 {isLoading ? (
                   <tr><td colSpan="5" className="px-4 py-8 text-center text-dark-400">Loading participants...</td></tr>
                 ) : participants.length === 0 ? (
                   <tr><td colSpan="5" className="px-4 py-8 text-center text-dark-400">No participants registered yet.</td></tr>
                 ) : (
                   participants.map((p, idx) => (
                     <tr key={p.registrationId || idx} className="hover:bg-dark-50/50 transition-colors">
                       <td className="px-4 py-3 font-medium text-dark-900">{p.studentName || 'N/A'}</td>
                       <td className="px-4 py-3 text-dark-500">{p.studentEmail || 'N/A'}</td>
                       <td className="px-4 py-3">
                         <span className="font-mono text-xs bg-dark-100 text-dark-700 px-2 py-1 rounded">
                           {p.ticketCode || 'N/A'}
                         </span>
                       </td>
                       <td className="px-4 py-3">
                         <Badge color={p.ticketStatus === 'CONFIRMED' || p.ticketStatus === 'VALID' ? 'green' : 'gray'} size="sm">
                           {p.ticketStatus || 'N/A'}
                         </Badge>
                       </td>
                       <td className="px-4 py-3">
                         <Badge color={p.paymentStatus === 'PAID' || p.paymentStatus === 'COMPLETED' ? 'green' : 'amber'} size="sm">
                           {p.paymentStatus || 'N/A'}
                         </Badge>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
           )}
        </div>
      </div>
    </Modal>
  )
}
