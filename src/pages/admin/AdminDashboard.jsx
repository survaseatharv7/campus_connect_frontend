import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Building2, Users, Calendar, Ticket, TrendingUp,
  Plus, Megaphone, ArrowRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import adminAPI from '../../api/admin.api'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { SkeletonStatCards } from '../../components/ui/Skeleton'
import { COLLEGE_STATUS_COLORS } from '../../utils/constants'
import { formatDate, formatEnumLabel } from '../../utils/formatters'

const PIE_COLORS = ['#22c55e', '#f59e0b', '#64748b']

export default function AdminDashboard() {
  const navigate = useNavigate()

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminAPI.getDashboard().then((r) => r.data.data || r.data),
  })

  const { data: colleges } = useQuery({
    queryKey: ['admin-colleges'],
    queryFn: () => adminAPI.getColleges().then((r) => r.data.data || r.data),
  })

  const collegeStatusData = colleges
    ? ['ACTIVE', 'PENDING', 'INACTIVE'].map((status) => ({
        name: formatEnumLabel(status),
        value: (Array.isArray(colleges) ? colleges : []).filter((c) => c.status === status).length,
      }))
    : []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-dark-900">Admin Dashboard</h1>
          <p className="text-dark-500 text-sm mt-1">Overview of your campus platform</p>
        </div>
        <div className="flex gap-3">
          <Button size="sm" icon={Plus} onClick={() => navigate('/admin/colleges')}>
            Create College
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Megaphone}
            onClick={() => navigate('/admin/broadcasts')}
          >
            Broadcast
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      {isLoading ? (
        <SkeletonStatCards count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Building2}
            label="Total Colleges"
            value={dashboard?.totalColleges || 0}
            color="blue"
            delay={0}
          />
          <StatCard
            icon={Users}
            label="Total Users"
            value={dashboard?.totalUsers || 0}
            color="purple"
            delay={0.1}
          />
          <StatCard
            icon={Calendar}
            label="Total Events"
            value={dashboard?.totalEvents || 0}
            color="orange"
            delay={0.2}
          />
          <StatCard
            icon={Ticket}
            label="Total Registrations"
            value={dashboard?.totalRegistrations || 0}
            color="green"
            delay={0.3}
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar Chart: Colleges by Status */}
        <Card hover={false}>
          <h3 className="text-lg font-semibold font-heading text-dark-900 mb-4">
            Colleges by Status
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collegeStatusData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="value" fill="#1a56db" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Chart */}
        <Card hover={false}>
          <h3 className="text-lg font-semibold font-heading text-dark-900 mb-4">
            Status Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={collegeStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {collegeStatusData.map((entry, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Colleges */}
      <Card hover={false}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold font-heading text-dark-900">Recent Colleges</h3>
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/admin/colleges')}
          >
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                  College
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(colleges) ? colleges : []).slice(0, 5).map((college, idx) => (
                <motion.tr
                  key={college.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-dark-50 hover:bg-dark-50/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-dark-900">{college.name}</p>
                        <p className="text-xs text-dark-400">
                          {college.city}, {college.state}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-sm bg-dark-50 px-2 py-0.5 rounded text-dark-700">
                      {college.uniqueCode}
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    <Badge color={COLLEGE_STATUS_COLORS[college.status]} size="sm" dot>
                      {formatEnumLabel(college.status)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-dark-500">
                    {formatDate(college.createdAt)}
                  </td>
                </motion.tr>
              ))}
              {(!colleges || (Array.isArray(colleges) && colleges.length === 0)) && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-dark-400 text-sm">
                    No colleges yet. Create your first college to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
