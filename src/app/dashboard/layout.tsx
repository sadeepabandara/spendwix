'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/store'
import { getLast12Months, getMonthLabel } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/dashboard/income', label: 'Income', icon: 'M7 11l5-5m0 0l5 5m-5-5v12' },
  { href: '/dashboard/bills', label: 'Bills', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { href: '/dashboard/expenses', label: 'Expenses', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { href: '/dashboard/savings', label: 'Savings', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { href: '/dashboard/debt', label: 'Debt', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { href: '/dashboard/transactions', label: 'Transactions', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { href: '/dashboard/daily', label: 'Daily', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
]

const BOTTOM_NAV = [
  { href: '/dashboard', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/dashboard/transactions', label: 'Transactions', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { href: '/dashboard/expenses', label: 'Expenses', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { href: '/dashboard/savings', label: 'Savings', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { href: '/dashboard/income', label: 'More', icon: 'M4 6h16M4 12h16M4 18h16' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { currentMonth, setCurrentMonth, sidebarOpen, setSidebarOpen } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const months = getLast12Months()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/auth')
    })
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false) }, [pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  const Logo = () => (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center justify-center flex-shrink-0 rounded-lg w-7 h-7"
        style={{ background: 'linear-gradient(135deg, #6b5ce6, #ea5c84)' }}>
        <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
          <path d="M4 9h10M9 4v10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="9" cy="9" r="2" fill="white" fillOpacity="0.9"/>
        </svg>
      </div>
      <span className="text-sm font-bold tracking-tight"
        style={{ background: 'linear-gradient(135deg, #6b5ce6, #ea5c84)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          SpendWix
      </span>
    </div>
  )

  const NavLink = ({ href, label, icon, onClick }: { href: string; label: string; icon: string; onClick?: () => void }) => {
    const active = pathname === href
    return (
      <Link href={href} onClick={onClick}
        className={clsx('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative',
          active ? 'text-white font-semibold' : 'text-gray-500 dark:text-gray-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400')}
        style={active ? { background: 'linear-gradient(135deg, #6b5ce6, #ea5c84)' } : {}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          <path d={icon}/>
        </svg>
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0e0c1a]">

      {/* ── DESKTOP SIDEBAR (lg+) ── */}
      <motion.aside
        animate={{ width: sidebarOpen ? 224 : 64 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden lg:flex flex-col border-r border-brand-100 dark:border-brand-900/30 bg-white dark:bg-[#110f1e] flex-shrink-0 overflow-hidden z-30"
      >
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-brand-100 dark:border-brand-900/30">
          <div className="flex items-center justify-center flex-shrink-0 rounded-lg w-7 h-7"
            style={{ background: 'linear-gradient(135deg, #6b5ce6, #ea5c84)' }}>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M4 9h10M9 4v10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="9" cy="9" r="2" fill="white" fillOpacity="0.9"/>
            </svg>
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                className="text-sm font-bold tracking-tight whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #6b5ce6, #ea5c84)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SpendWix
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-3 pt-3 pb-1">
              <select value={currentMonth} onChange={e => setCurrentMonth(e.target.value)}
                className="w-full text-xs rounded-lg px-2.5 py-2 focus:outline-none border border-brand-200 dark:border-brand-800/50 bg-brand-50/50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300">
                {months.map(m => <option key={m} value={m}>{getMonthLabel(m)}</option>)}
              </select>
            </motion.div>
          )}
        </AnimatePresence>

        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                className={clsx('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative',
                  active ? 'text-white font-semibold' : 'text-gray-500 dark:text-gray-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-600')}
                style={active ? { background: 'linear-gradient(135deg, #6b5ce6, #ea5c84)' } : {}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <path d={icon}/>
                </svg>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </nav>

        <div className="px-2 pb-4 pt-3 space-y-0.5 border-t border-brand-100 dark:border-brand-900/30">
          {[
            { href: '/dashboard/upgrade', label: 'Upgrade to Pro', icon: 'M5 3l14 9-14 9V3z', accent: true },
            { href: '/dashboard/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z', accent: false },
          ].map(({ href, label, icon, accent }) => (
            <Link key={href} href={href}
              className={clsx('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                pathname === href ? 'text-white font-semibold' : accent ? 'text-accent-500 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-950/30' : 'text-gray-500 dark:text-gray-400 hover:bg-brand-50 dark:hover:bg-brand-900/30')}
              style={pathname === href ? { background: 'linear-gradient(135deg, #6b5ce6, #ea5c84)' } : {}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d={icon}/>
              </svg>
              {sidebarOpen && <span className="whitespace-nowrap">{label}</span>}
            </Link>
          ))}
          <button onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            {sidebarOpen && <span className="whitespace-nowrap">Sign out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Desktop sidebar toggle button */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hidden lg:flex absolute top-[3.2rem] z-40 w-5 h-8 items-center justify-center rounded-r-lg transition-all"
        style={{
          left: sidebarOpen ? '13.5rem' : '3.5rem',
          background: 'linear-gradient(135deg, rgba(107,92,230,0.15), rgba(234,92,132,0.1))',
          border: '1px solid rgba(107,92,230,0.2)',
          borderLeft: 'none',
        }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#6b5ce6" strokeWidth="1.5">
          {sidebarOpen ? <path d="M6 2L3 5l3 3"/> : <path d="M3 2l3 3-3 3"/>}
        </svg>
      </button>

      {/* ── TABLET SIDEBAR (md only) - slide-over drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}/>
            <motion.div
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-white dark:bg-[#110f1e] border-r border-brand-100 dark:border-brand-900/30 flex flex-col shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between h-16 px-5 border-b border-brand-100 dark:border-brand-900/30">
                <Logo/>
                <button onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-8 h-8 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              {/* Month selector in drawer */}
              <div className="px-4 pt-4 pb-2">
                <label className="text-xs text-gray-400 font-medium mb-1.5 block">Month</label>
                <select value={currentMonth} onChange={e => setCurrentMonth(e.target.value)}
                  className="w-full text-sm rounded-xl px-3 py-2.5 focus:outline-none border border-brand-200 dark:border-brand-800/50 bg-brand-50/50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300">
                  {months.map(m => <option key={m} value={m}>{getMonthLabel(m)}</option>)}
                </select>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
                {NAV.map(({ href, label, icon }) => (
                  <NavLink key={href} href={href} label={label} icon={icon} onClick={() => setMobileMenuOpen(false)}/>
                ))}
              </nav>

              {/* Bottom links */}
              <div className="px-3 pb-6 pt-3 space-y-0.5 border-t border-brand-100 dark:border-brand-900/30">
                <NavLink href="/dashboard/upgrade" label="Upgrade to Pro" icon="M5 3l14 9-14 9V3z" onClick={() => setMobileMenuOpen(false)}/>
                <NavLink href="/dashboard/settings" label="Settings" icon="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" onClick={() => setMobileMenuOpen(false)}/>
                <button onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Mobile/Tablet top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 h-14 bg-white dark:bg-[#110f1e] border-b border-brand-100 dark:border-brand-900/30 flex-shrink-0 z-20">
          <button onClick={() => setMobileMenuOpen(true)}
            className="flex items-center justify-center text-gray-500 transition-colors w-9 h-9 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18"/>
            </svg>
          </button>
          <Logo/>
          <select value={currentMonth} onChange={e => setCurrentMonth(e.target.value)}
            className="text-xs rounded-lg px-2 py-1.5 border border-brand-200 dark:border-brand-800/50 bg-brand-50/50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 focus:outline-none max-w-[110px]">
            {months.map(m => <option key={m} value={m}>{getMonthLabel(m)}</option>)}
          </select>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-6xl px-4 py-4 pb-24 mx-auto sm:px-6 sm:py-6 lg:pb-6"
          >
            {children}
          </motion.div>
        </main>

        {/* ── MOBILE BOTTOM NAV (sm only) ── */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-[#110f1e] border-t border-brand-100 dark:border-brand-900/30"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="flex items-center justify-around h-16 px-2">
            {BOTTOM_NAV.map(({ href, label, icon }) => {
              const active = pathname === href || (label === 'More' && !['/dashboard', '/dashboard/transactions', '/dashboard/expenses', '/dashboard/savings'].includes(pathname))
              return (
                <Link key={href} href={href}
                  className="flex flex-col items-center min-w-0 gap-1 px-3 py-2 transition-all rounded-xl">
                  <div className={clsx('w-8 h-8 flex items-center justify-center rounded-xl transition-all', active ? 'text-white' : 'text-gray-400')}
                    style={active ? { background: 'linear-gradient(135deg, #6b5ce6, #ea5c84)' } : {}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d={icon}/>
                    </svg>
                  </div>
                  <span className={clsx('text-[10px] font-medium truncate', active ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400')}>
                    {label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
