'use client'

import { useStore } from '@/store'

interface Props {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export default function PageHeader({ title, subtitle, children }: Props) {
  const isPro = useStore((s) => s.profile?.plan === 'pro')

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight"
            style={{ background: 'linear-gradient(135deg, #6b5ce6, #ea5c84)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {title}
          </h1>
          {isPro && (
            <span className="badge-pro">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Pro
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children && <div className="flex-shrink-0">{children}</div>}
    </div>
  )
}
