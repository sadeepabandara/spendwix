'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'

const THEME_STORAGE_KEY = 'spendwix:theme'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (saved === 'dark' || saved === 'light') return saved
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function applyTheme(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', theme === 'dark')
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export default function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const initialTheme = getInitialTheme()
    setTheme(initialTheme)
    applyTheme(initialTheme)
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    applyTheme(nextTheme)
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={clsx(
        'inline-flex items-center justify-center rounded-xl border border-brand-200/70 dark:border-brand-800/60 bg-white/90 dark:bg-white/5 text-gray-700 dark:text-gray-200 shadow-sm backdrop-blur transition-all hover:scale-[1.02] hover:border-brand-300 dark:hover:border-brand-700',
        className,
      )}
      aria-label={mounted && theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={mounted && theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {mounted && theme === 'dark' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-300">
          <path d="M12 3a6 6 0 1 0 9 9A9 9 0 1 1 12 3Z" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )}
    </button>
  )
}
