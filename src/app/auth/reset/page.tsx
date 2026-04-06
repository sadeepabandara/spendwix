'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isRecoveryMode, setIsRecoveryMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is in password recovery mode
    document.documentElement.classList.add('dark')

    const checkRecoveryMode = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        setError('This link has expired or is invalid. Please request a new password reset.')
        return
      }
      setIsRecoveryMode(true)
    }

    // Listen for auth events to catch PASSWORD_RECOVERY
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true)
        setError('')
      } else if (!session) {
        setIsRecoveryMode(false)
      }
    })

    checkRecoveryMode()
    return () => subscription?.unsubscribe()
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setMessage('Password updated successfully!')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    }
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
        className="relative z-10 w-full max-w-md p-6 border rounded-2xl shadow-2xl sm:p-10 bg-white border-brand-200/70 dark:bg-gray-900 dark:border-brand-800/40"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <img src="/icon.svg" alt="SpendWix" className="w-8 h-8" />
            <span className="text-lg font-extrabold" style={{ background: 'linear-gradient(135deg, #a991fb, #ea5c84)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SpendWix
            </span>
          </div>

          {message ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mx-auto mb-4 rounded-full w-14 h-14" style={{ background: 'linear-gradient(135deg,#6b5ce6,#ea5c84)' }}>
                <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
                  <path d="M4 11l5 5 9-9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl dark:text-white">Password updated!</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to dashboard...</p>
            </motion.div>
          ) : (
            <>
              <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Reset your password</h1>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                {isRecoveryMode
                  ? 'Enter your new password below'
                  : 'Your link has expired. Please request a new one.'}
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 mb-4 text-sm rounded-lg bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                >
                  {error}
                </motion.div>
              )}

              {isRecoveryMode && (
                <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-brand-500"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-brand-500"
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !password || !confirmPassword}
                    className="w-full py-3 mt-4 font-semibold text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: loading ? '#9CA3AF' : 'linear-gradient(135deg,#6b5ce6,#ea5c84)',
                      boxShadow: loading ? 'none' : '0 4px 12px rgba(107,92,230,0.35)'
                    }}
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              )}

              {!isRecoveryMode && (
                <button
                  onClick={() => router.push('/auth')}
                  className="w-full py-3 mt-4 font-semibold text-white rounded-lg transition-all"
                  style={{ background: 'linear-gradient(135deg,#6b5ce6,#ea5c84)' }}
                >
                  Back to Sign In
                </button>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
