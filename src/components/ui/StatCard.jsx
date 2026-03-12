import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const iconBgColors = {
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  green: 'bg-emerald-100 text-emerald-600',
  orange: 'bg-orange-100 text-orange-600',
  red: 'bg-red-100 text-red-600',
  teal: 'bg-teal-100 text-teal-600',
  yellow: 'bg-amber-100 text-amber-600',
  indigo: 'bg-indigo-100 text-indigo-600',
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  color = 'blue',
  trend,
  trendValue,
  className,
  delay = 0,
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [displayValue, setDisplayValue] = useState(0)
  const numericValue = typeof value === 'number' ? value : parseInt(value, 10)
  const isNumber = !isNaN(numericValue)

  useEffect(() => {
    if (!isInView || !isNumber) return
    const duration = 1500
    const steps = 60
    const stepValue = numericValue / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(Math.round(stepValue * step), numericValue)
      setDisplayValue(current)
      if (step >= steps) clearInterval(timer)
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isInView, numericValue, isNumber])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-dark-500 mb-1">{label}</p>
          <p className="text-3xl font-bold font-heading text-dark-900 count-up">
            {isNumber ? displayValue.toLocaleString('en-IN') : value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  'text-sm font-medium',
                  trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                )}
              >
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
              <span className="text-xs text-dark-400">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              iconBgColors[color] || iconBgColors.blue
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </motion.div>
  )
}
