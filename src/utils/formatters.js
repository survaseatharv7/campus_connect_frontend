import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'

/**
 * Format a date string to a readable format.
 * @param {string|Date} dateStr
 * @param {string} formatStr - date-fns format string
 * @returns {string}
 */
export function formatDate(dateStr, formatStr = 'MMM dd, yyyy') {
  if (!dateStr) return '—'
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
    if (!isValid(date)) return '—'
    return format(date, formatStr)
  } catch {
    return '—'
  }
}

/**
 * Format a date string to a readable date-time format.
 */
export function formatDateTime(dateStr) {
  return formatDate(dateStr, 'MMM dd, yyyy • hh:mm a')
}

/**
 * Format a date string to a relative time string.
 */
export function formatRelativeTime(dateStr) {
  if (!dateStr) return '—'
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
    if (!isValid(date)) return '—'
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return '—'
  }
}

/**
 * Format a time string (HH:mm) to 12-hour format.
 */
export function formatTime(timeStr) {
  if (!timeStr) return '—'
  try {
    const [hours, minutes] = timeStr.split(':').map(Number)
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const h = hours % 12 || 12
    return `${h}:${String(minutes).padStart(2, '0')} ${ampm}`
  } catch {
    return timeStr
  }
}

/**
 * Format currency (INR).
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '—'
  if (amount === 0) return 'FREE'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Convert enum-style strings to readable labels.
 * e.g. "PENDING_HOD" → "Pending HOD"
 */
export function formatEnumLabel(value) {
  if (!value) return '—'
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Truncate text to a maximum length and add ellipsis.
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Format a number with commas.
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0'
  return new Intl.NumberFormat('en-IN').format(num)
}

/**
 * Get initials from a name string.
 */
export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('')
}

/**
 * Get a color class based on a status value and color map.
 */
export function getStatusColor(value, colorMap) {
  const color = colorMap?.[value] || 'gray'
  return color
}
