import { forwardRef, useState } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Eye, EyeOff } from 'lucide-react'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const Input = forwardRef(function Input(
  { label, error, helperText, icon: Icon, type = 'text', className, ...props },
  ref
) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-dark-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon className={cn('w-5 h-5', error ? 'text-red-400' : 'text-dark-400')} />
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={cn(
            'w-full px-4 py-3 bg-white border rounded-xl text-dark-900 placeholder-dark-400',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
            error
              ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
              : 'border-dark-200 hover:border-dark-300',
            Icon && 'pl-11',
            isPassword && 'pr-11',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-dark-400 hover:text-dark-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-dark-400">{helperText}</p>
      )}
    </div>
  )
})

export default Input
