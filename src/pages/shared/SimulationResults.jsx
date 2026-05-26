import { motion } from 'framer-motion'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine
} from 'recharts'
import { Activity, Zap, CheckCircle2 } from 'lucide-react'

// ─── Chart 1: Endpoint Distribution by Role ───
const endpointData = [
  { role: 'Auth',         GET: 2,  POST: 4, 'PUT/DELETE': 0 },
  { role: 'Student',      GET: 10, POST: 5, 'PUT/DELETE': 1 },
  { role: 'Professor',    GET: 8,  POST: 5, 'PUT/DELETE': 6 },
  { role: 'HOD',          GET: 5,  POST: 5, 'PUT/DELETE': 7 },
  { role: 'Principal',    GET: 7,  POST: 5, 'PUT/DELETE': 7 },
  { role: 'Campus Admin', GET: 5,  POST: 4, 'PUT/DELETE': 4 },
  { role: 'Webhook',      GET: 1,  POST: 1, 'PUT/DELETE': 0 },
]

// ─── Chart 2: Concurrent Users vs System Response Time (unchanged) ───
const responseTimeData = [
  { users: 1,   'GET Events Avg': 45,  'GET Events P90': 62,  'POST Login Avg': 38,  'POST Login P90': 55  },
  { users: 5,   'GET Events Avg': 52,  'GET Events P90': 75,  'POST Login Avg': 44,  'POST Login P90': 68  },
  { users: 10,  'GET Events Avg': 68,  'GET Events P90': 95,  'POST Login Avg': 58,  'POST Login P90': 84  },
  { users: 20,  'GET Events Avg': 95,  'GET Events P90': 138, 'POST Login Avg': 82,  'POST Login P90': 120 },
  { users: 50,  'GET Events Avg': 148, 'GET Events P90': 210, 'POST Login Avg': 128, 'POST Login P90': 186 },
  { users: 100, 'GET Events Avg': 265, 'GET Events P90': 380, 'POST Login Avg': 198, 'POST Login P90': 295 },
]

// ─── Chart 3: Module Test Coverage ───
const coverageData = [
  { module: 'Authentication',     tests: 6  },
  { module: 'Event Management',   tests: 18 },
  { module: 'Dept Management',    tests: 3  },
  { module: 'College Management', tests: 6  },
  { module: 'Hall & Timetable',   tests: 14 },
  { module: 'Broadcast',          tests: 5  },
  { module: 'Club Governance',    tests: 9  },
  { module: 'Batch/Submissions',  tests: 10 },
  { module: 'Webhook',            tests: 1  },
  { module: 'Notes & Progress',   tests: 11 },
]

// ─── Summary Stats ───
const summaryStats = [
  {
    icon: Activity,
    value: '88',
    label: 'Total REST Endpoints',
    bg: 'bg-indigo-50',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    icon: Zap,
    value: '< 200ms',
    label: 'Avg Response (≤50 users)',
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    icon: CheckCircle2,
    value: '100%',
    label: 'Module Test Pass Rate',
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
]

// ─── Custom Tooltip (used by Chart 2) ───
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-4 py-3">
      <p className="text-sm font-semibold text-gray-800 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-xs text-gray-600">
          <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
          {entry.name}: <span className="font-medium text-gray-800">{entry.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function SimulationResults() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Simulation Results</h1>
        <p className="text-sm text-gray-500 mt-1">
          Performance metrics and test coverage · Apache JMeter 5.6 · Intel Core i7-12700H, 16 GB RAM, NVMe SSD, PostgreSQL 16
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {summaryStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className={`${stat.bg} rounded-xl p-5 flex items-center gap-4`}
            >
              <div className={`p-3 ${stat.iconBg} rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Chart 1: Endpoint Distribution by Role */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-800">Endpoint Distribution by Role</h2>
        <p className="text-sm text-gray-500 mt-1 mb-5">
          Distribution of REST API endpoints by HTTP method across all user roles
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={endpointData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="role" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 16]} tickCount={9} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="GET" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="POST" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="PUT/DELETE" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Chart 2: Concurrent Users vs System Response Time (unchanged) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-800">Concurrent Users vs System Response Time</h2>
        <p className="text-sm text-gray-500 mt-1 mb-5">
          Shows average response time and 90th percentile response time (ms) for GET Events and POST Login
          APIs as user load scales from 1 to 100 concurrent users.
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={responseTimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="users"
              tick={{ fontSize: 12 }}
              label={{ value: 'Concurrent Users', position: 'insideBottom', offset: -5, fontSize: 12 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 13 }} />
            <ReferenceLine
              y={200}
              stroke="#ef4444"
              strokeDasharray="6 4"
              label={{ value: '200ms SLA threshold', position: 'insideTopRight', fill: '#ef4444', fontSize: 11 }}
            />
            <Line type="monotone" dataKey="GET Events Avg" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="GET Events P90" stroke="#a78bfa" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="POST Login Avg" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="POST Login P90" stroke="#86efac" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Chart 3: Module Test Coverage (Horizontal Bar) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-800">Module Test Coverage</h2>
        <p className="text-sm text-gray-500 mt-1 mb-5">
          All modules achieved 100% test pass rate across functional and integration testing cycles
        </p>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart layout="vertical" data={coverageData} margin={{ top: 5, right: 40, left: 120, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 18]}
              tickCount={10}
              tick={{ fontSize: 12 }}
              label={{ value: 'Test Cases (All Passed)', position: 'insideBottom', offset: -2, fontSize: 12 }}
            />
            <YAxis type="category" dataKey="module" width={115} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => [`${value} / ${value} Passed`, 'Test Cases']} />
            <Bar
              dataKey="tests"
              fill="#3b82f6"
              radius={[0, 4, 4, 0]}
              label={{ position: 'right', fontSize: 12, fill: '#374151', formatter: (v) => `${v}/${v}` }}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
