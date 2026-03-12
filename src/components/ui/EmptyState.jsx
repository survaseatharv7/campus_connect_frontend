import { motion } from 'framer-motion'
import { FolderOpen } from 'lucide-react'

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  action,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center justify-center py-16 px-6 ${className}`}
    >
      <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-primary-400" />
      </div>
      <h3 className="text-xl font-semibold font-heading text-dark-900 mb-2 text-center">
        {title}
      </h3>
      <p className="text-dark-500 text-center max-w-sm mb-6">{description}</p>
      {action && action}
    </motion.div>
  )
}
