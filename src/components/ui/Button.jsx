import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Loader2 } from 'lucide-react'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const variants = {
  primary:
    'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'bg-white text-dark-700 border border-dark-200 hover:bg-dark-50 hover:border-dark-300',
  danger:
    'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
  success:
    'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
  ghost:
    'bg-transparent text-dark-600 hover:bg-dark-100',
  accent:
    'bg-gradient-to-r from-accent-400 to-accent-500 text-dark shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
  outline:
    'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5',
}

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon: Icon,
    iconPosition = 'left',
    className,
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30',
        variants[variant],
        sizes[size],
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </button>
  )
})

export default Button
