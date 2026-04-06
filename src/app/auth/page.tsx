'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const THEME_STORAGE_KEY = 'spendwix:theme'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
)

const AppleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 48 48"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M35.2 26.6c-.1-5.2 4.3-7.7 4.5-7.8-2.4-3.5-6.2-4-7.6-4-3.2-.3-6.2 1.9-7.8 1.9-1.6 0-4.1-1.8-6.8-1.8-3.5.1-6.8 2.1-8.6 5.2-3.7 6.4-.9 15.8 2.6 20.9 1.7 2.5 3.8 5.3 6.5 5.2 2.6-.1 3.6-1.7 6.8-1.7s4.1 1.7 6.9 1.6c2.8-.1 4.6-2.6 6.4-5.1 2-2.9 2.8-5.7 2.9-5.9-.1 0-5.5-2.1-5.6-8.4M32.2 11.7c1.4-1.7 2.4-4.1 2.1-6.5-2.1.1-4.6 1.4-6.1 3.1-1.3 1.5-2.5 4-2.2 6.3 2.3.2 4.7-1.2 6.2-2.9Z" />
  </svg>
)



export default function AuthPage() {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Auth screen always keeps the outside shell in dark style.
    document.documentElement.classList.add('dark')
  }, [])

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (tab === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })
      if (error) setError(error.message)
      else setMessage('Check your email to confirm your account!')
    }

    setLoading(false)
  }

  const handleOAuth = async (provider: 'google' | 'apple') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
    if (error) setError(error.message)
  }

  const handleForgot = async () => {
    if (!email) { setError('Enter your email first'); return }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/reset`,
    })
    if (error) setError(error.message)
    else setMessage('Password reset email sent!')
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen p-3 overflow-hidden sm:p-4" style={{ background: '#0e0b1f' }}>

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full -top-32 -left-32 w-96 h-96 opacity-20 blur-3xl animate-pulse bg-[radial-gradient(circle,_rgba(107,92,230,0.22),_transparent_70%)] dark:bg-[radial-gradient(circle,_#6b5ce6,_transparent_70%)]"/>
        <div className="absolute rounded-full opacity-20 top-1/2 -right-32 w-80 h-80 blur-3xl animate-pulse bg-[radial-gradient(circle,_rgba(234,92,132,0.18),_transparent_70%)] dark:bg-[radial-gradient(circle,_#ea5c84,_transparent_70%)]" style={{ animationDelay: '1s' }}/>
        <div className="absolute rounded-full -bottom-20 left-1/3 w-72 h-72 opacity-15 blur-3xl animate-pulse bg-[radial-gradient(circle,_rgba(169,154,243,0.2),_transparent_70%)] dark:bg-[radial-gradient(circle,_#a99af3,_transparent_70%)]" style={{ animationDelay: '2s' }}/>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 grid w-full max-w-4xl grid-cols-1 overflow-hidden border shadow-2xl md:grid-cols-2 rounded-2xl sm:rounded-3xl border-brand-200/70 dark:border-brand-800/40"
      >

        {/* Left panel */}
        <div className="relative p-6 sm:p-10 md:flex hidden flex-col justify-between min-h-[480px] sm:min-h-[300px] lg:min-h-[580px] overflow-hidden" style={{ background: 'linear-gradient(135deg, #120e2e 0%, #1e1540 50%, #2a1550 100%)' }}>
          {/* Decorative grid */}
          <div className="absolute inset-0 opacity-[0.08] dark:opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(107,92,230,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(107,92,230,0.4) 1px,transparent 1px)',
            backgroundSize: '40px 40px'
          }}/>

          {/* Glow orb */}
          <div className="absolute right-0 w-48 h-48 rounded-full opacity-25 top-1/4 blur-3xl dark:opacity-40" style={{ background: 'radial-gradient(circle, #ea5c84, transparent 70%)' }}/>

          {/* Logo */}
          <div className="relative flex items-center gap-2.5">
            <img src="/icon.svg" alt="SpendWix" className="w-9 h-9" />
            <div className="leading-none">
              <div className="text-lg font-extrabold tracking-tight mt-[-6px]" style={{ background: 'linear-gradient(135deg, #a991fb, #ea5c84)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SpendWix
              </div>
              <div className="mt-[2px] text-[9px] font-medium tracking-[0.12em]" style={{ color: '#cbc1ff' }}>
                BUDGET · TRACK · GROW
              </div>
            </div>
          </div>

          {/* Main copy */}
          <div className="relative">
            <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold border rounded-full bg-brand-100/80 text-brand-700 border-brand-200 dark:bg-brand-950/50 dark:text-brand-300 dark:border-brand-800/50">
              ✦ Budget smarter, live freer
            </div>
            <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
              Your money,<br/>
              <span className="text-transparent bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text">
                under control.
              </span>
            </h1>
            <p className="max-w-xs text-sm leading-relaxed text-gray-600 dark:text-[#8b83b8]">
              Track income, bills, expenses, savings and debt — all in one clean dashboard built for your generation.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-8">
              {[['$0','to start'],['2 min','setup'],['100%','private']].map(([val, lbl]) => (
                <div key={lbl} className="p-3 text-center border rounded-2xl bg-white/80 border-brand-200/70 dark:bg-brand-950/20 dark:border-brand-800/40">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{val}</div>
                  <div className="text-xs mt-0.5 text-gray-500 dark:text-[#8b83b8]">{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="relative pt-5 border-t border-brand-200/70 dark:border-brand-800/30">
            <p className="text-xs italic text-gray-600 dark:text-[#6b63a0]">
              &quot;Finally a budget app that doesn&apos;t feel overwhelming.&quot;
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-[#4a4572]">— Early user</p>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col justify-center p-6 bg-white sm:p-10">
          <AnimatePresence mode="wait">
            {message ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center"
              >
                <div className="flex items-center justify-center mx-auto mb-4 rounded-full w-14 h-14" style={{ background: 'linear-gradient(135deg,#6b5ce6,#ea5c84)' }}>
                  <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
                    <path d="M4 11l5 5 9-9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">Check your email</h2>
                <p className="text-sm text-gray-500">{message}</p>
                <button onClick={() => setMessage('')} className="mt-6 btn-secondary">Back to sign in</button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
              >
                {/* Tab toggle */}
                <div className="flex p-1 border mb-7 rounded-xl bg-brand-50 border-brand-100">
                  {(['signin','signup'] as const).map(t => (
                    <button key={t} onClick={() => { setTab(t); setError('') }}
                      className="flex-1 py-2.5 text-sm rounded-lg font-semibold transition-all"
                      style={tab === t ? {
                        background: 'linear-gradient(135deg,#6b5ce6,#ea5c84)',
                        color: 'white',
                        boxShadow: '0 2px 12px rgba(107,92,230,0.35)'
                      } : { color: '#8b95b7' }}
                    >
                      {t === 'signin' ? 'Sign in' : 'Create account'}
                    </button>
                  ))}
                </div>

                <motion.h2
                  key={tab + 'h'}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-1 text-xl font-bold text-gray-900 sm:text-2xl"
                >
                  {tab === 'signin' ? 'Welcome back 👋' : 'Get started free ✦'}
                </motion.h2>
                <p className="mb-6 text-sm text-gray-400">
                  {tab === 'signin' ? 'Sign in to your SpendWix account' : 'Create your account — no credit card needed'}
                </p>

                {/* Social auth */}
                <div className="flex flex-col gap-3 mb-6">
                  <button onClick={() => handleOAuth('google')}
                    className="flex items-center justify-center gap-3 py-3 text-sm font-semibold text-gray-700 transition-all bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm">
                    <GoogleIcon />
                    Continue with Google
                  </button>
                  <button onClick={() => handleOAuth('apple')}
                    className="flex items-center justify-center gap-3 py-3 text-sm font-semibold text-gray-700 transition-all bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm">
                    <AppleIcon />
                    Continue with Apple
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-gray-100"/>
                  <span className="text-xs font-medium text-gray-400">or with email</span>
                  <div className="flex-1 h-px bg-gray-100"/>
                </div>

                <form onSubmit={handleEmail} className="flex flex-col gap-4">
                  <AnimatePresence>
                    {tab === 'signup' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label className="label dark:!text-gray-500">Full name</label>
                        <input className="input dark:!bg-white dark:!text-gray-900 dark:!border-gray-200 dark:placeholder:!text-gray-400" type="text" placeholder="Alex Johnson" value={name} onChange={e => setName(e.target.value)} required/>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div>
                    <label className="label dark:!text-gray-500">Email</label>
                    <input className="input dark:!bg-white dark:!text-gray-900 dark:!border-gray-200 dark:placeholder:!text-gray-400" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required/>
                  </div>
                  <div>
                    <label className="label dark:!text-gray-500">Password</label>
                    <input className="input dark:!bg-white dark:!text-gray-900 dark:!border-gray-200 dark:placeholder:!text-gray-400" type="password" placeholder={tab === 'signup' ? 'Min. 8 characters' : '••••••••'} value={password} onChange={e => setPassword(e.target.value)} required minLength={8}/>
                  </div>

                  {tab === 'signin' && (
                    <button type="button" onClick={handleForgot} className="-mt-2 text-xs text-right text-gray-400 transition-colors hover:text-brand-500">
                      Forgot password?
                    </button>
                  )}

                  {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-3 py-2 text-xs text-red-500 border border-red-100 rounded-lg bg-red-50">
                      {error}
                    </motion.p>
                  )}

                  <button type="submit" disabled={loading}
                    className="flex items-center justify-center gap-2 py-3 mt-1 text-base btn-primary"
                    style={{ boxShadow: '0 4px 20px rgba(107,92,230,0.4)' }}
                  >
                    {loading && <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12"/></svg>}
                    {tab === 'signin' ? 'Sign in' : 'Create account'}
                  </button>
                </form>

                <p className="mt-5 text-xs leading-relaxed text-center text-gray-400">
                  By continuing you agree to our{' '}
                  <a href="#" className="underline hover:text-brand-500">terms</a>{' '}and{' '}
                  <a href="#" className="underline hover:text-brand-500">privacy policy</a>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
