import clsx from 'clsx'
import { motion } from 'framer-motion'

interface Props {
  label: string
  value: string
  sub?: string
  color?: 'default' | 'green' | 'red' | 'amber'
}

export default function StatCard({ label, value, sub, color = 'default' }: Props) {
  return (
    <motion.div
      className="metric-card"
      whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(107,92,230,0.12)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="metric-label text-xs">{label}</div>
      <div className={clsx('metric-value text-xl sm:text-2xl', {
        'text-gray-900 dark:text-white': color === 'default',
        'text-brand-600 dark:text-brand-400': color === 'green',
        'text-red-500 dark:text-red-400': color === 'red',
        'text-amber-600 dark:text-amber-400': color === 'amber',
      })}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </motion.div>
  )
}
