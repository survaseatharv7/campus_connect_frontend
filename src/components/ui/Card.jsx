import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export default function Card({ children, className, hover = true, padding = true, ...props }) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-card',
        hover && 'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5',
        padding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={cn('text-lg font-semibold font-heading text-dark-900', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p className={cn('text-sm text-dark-500 mt-1', className)} {...props}>
      {children}
    </p>
  )
}
