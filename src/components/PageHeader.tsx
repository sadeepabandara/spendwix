interface Props {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export default function PageHeader({ title, subtitle, children }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
      <div>
        <h1 className="text-lg sm:text-xl font-bold tracking-tight"
          style={{ background: 'linear-gradient(135deg, #6b5ce6, #ea5c84)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {title}
        </h1>
        {subtitle && <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children && <div className="flex-shrink-0">{children}</div>}
    </div>
  )
}
