import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const colorMap = {
  blue: {
    solid: 'bg-blue-500 text-white',
    soft: 'bg-blue-50 text-blue-700 border border-blue-200',
    outline: 'border border-blue-500 text-blue-600',
  },
  green: {
    solid: 'bg-emerald-500 text-white',
    soft: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    outline: 'border border-emerald-500 text-emerald-600',
  },
  red: {
    solid: 'bg-red-500 text-white',
    soft: 'bg-red-50 text-red-700 border border-red-200',
    outline: 'border border-red-500 text-red-600',
  },
  yellow: {
    solid: 'bg-amber-500 text-white',
    soft: 'bg-amber-50 text-amber-700 border border-amber-200',
    outline: 'border border-amber-500 text-amber-600',
  },
  orange: {
    solid: 'bg-orange-500 text-white',
    soft: 'bg-orange-50 text-orange-700 border border-orange-200',
    outline: 'border border-orange-500 text-orange-600',
  },
  purple: {
    solid: 'bg-purple-500 text-white',
    soft: 'bg-purple-50 text-purple-700 border border-purple-200',
    outline: 'border border-purple-500 text-purple-600',
  },
  teal: {
    solid: 'bg-teal-500 text-white',
    soft: 'bg-teal-50 text-teal-700 border border-teal-200',
    outline: 'border border-teal-500 text-teal-600',
  },
  gray: {
    solid: 'bg-gray-500 text-white',
    soft: 'bg-gray-100 text-gray-700 border border-gray-200',
    outline: 'border border-gray-400 text-gray-600',
  },
  indigo: {
    solid: 'bg-indigo-500 text-white',
    soft: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    outline: 'border border-indigo-500 text-indigo-600',
  },
}

const sizeMap = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export default function Badge({
  children,
  color = 'blue',
  variant = 'soft',
  size = 'md',
  className,
  dot = false,
  ...props
}) {
  const colors = colorMap[color] || colorMap.gray
  const variantClass = colors[variant] || colors.soft
  const sizeClass = sizeMap[size] || sizeMap.md

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap',
        variantClass,
        sizeClass,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            color === 'green' && 'bg-emerald-500',
            color === 'red' && 'bg-red-500',
            color === 'yellow' && 'bg-amber-500',
            color === 'blue' && 'bg-blue-500',
            color === 'gray' && 'bg-gray-500',
            color === 'purple' && 'bg-purple-500',
            color === 'orange' && 'bg-orange-500',
            color === 'teal' && 'bg-teal-500'
          )}
        />
      )}
      {children}
    </span>
  )
}
