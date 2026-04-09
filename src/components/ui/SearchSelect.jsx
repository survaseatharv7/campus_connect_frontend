import { useState, useRef, useEffect, useMemo } from 'react'
import { Search, ChevronDown, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Spinner from './Spinner'

export default function SearchSelect({
  label,
  placeholder = 'Search...',
  options = [],
  value,
  onChange,
  isLoading = false,
  error,
  className = '',
  disabled = false,
  displayValue = (option) => option.name,
  searchValue = (option) => option.name,
  renderOption = (option) => (
    <div className="flex flex-col">
      <span className="font-medium text-dark-900">{option.name}</span>
      {option.email && <span className="text-xs text-dark-500">{option.email}</span>}
    </div>
  ),
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef(null)

  const selectedOption = useMemo(() => options.find((opt) => opt.id === value), [options, value])

  const filteredOptions = useMemo(() => {
    if (!query) return options
    return options.filter((opt) =>
      searchValue(opt).toLowerCase().includes(query.toLowerCase())
    )
  }, [options, query, searchValue])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option) => {
    onChange(option.id)
    setIsOpen(false)
    setQuery('')
  }

  const clearSelection = (e) => {
    e.stopPropagation()
    onChange('')
  }

  return (
    <div className={`space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-dark-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            relative w-full flex items-center gap-2 px-3.5 py-2.5 bg-white border rounded-xl cursor-default transition-all duration-200
            ${error ? 'border-red-300 ring-2 ring-red-50' : 'border-dark-200 hover:border-primary-300'}
            ${isOpen ? 'ring-4 ring-primary-50 border-primary-500' : ''}
            ${disabled ? 'opacity-60 cursor-not-allowed bg-dark-50' : ''}
          `}
        >
          <Search className="w-4 h-4 text-dark-400 shrink-0" />
          
          <div className="flex-1 overflow-hidden">
            {selectedOption ? (
              <span className="block truncate text-dark-900 font-medium">
                {displayValue(selectedOption)}
              </span>
            ) : (
              <span className="block truncate text-dark-400">
                {placeholder}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {selectedOption && !disabled && (
              <button 
                type="button" 
                onClick={clearSelection}
                className="p-1 hover:bg-dark-100 rounded-lg text-dark-400 hover:text-dark-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <ChevronDown className={`w-4 h-4 text-dark-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              className="absolute z-50 w-full mt-2 bg-white border border-dark-200 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-2 border-b border-dark-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                  <input
                    autoFocus
                    className="w-full pl-9 pr-3 py-2 bg-dark-50 border-none rounded-xl text-sm focus:ring-0 placeholder:text-dark-400"
                    placeholder="Type to filter..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                {isLoading ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-3">
                    <Spinner size="sm" />
                    <span className="text-sm text-dark-500">Loading list...</span>
                  </div>
                ) : filteredOptions.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-dark-500 italic">No matches found</p>
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors
                        ${value === option.id ? 'bg-primary-50' : 'hover:bg-dark-50'}
                      `}
                    >
                      <div className="flex-1 min-w-0">
                        {renderOption(option)}
                      </div>
                      {value === option.id && (
                        <Check className="w-4 h-4 text-primary-600 shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="text-sm text-red-500 animate-in fade-in slide-in-from-top-1 transition-all">
          {error}
        </p>
      )}
    </div>
  )
}
