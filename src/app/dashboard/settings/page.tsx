'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/store'
import { useMonthData } from '@/hooks/useMonthData'
import { supabase } from '@/lib/supabase'
import { CURRENCY_OPTIONS, Currency } from '@/types'
import PageHeader from '@/components/PageHeader'

type ThemePreference = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'spendwix:theme'

function getThemePreference(): ThemePreference {
  if (typeof window === 'undefined') return 'light'
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
  return 'light'
}

function applyThemePreference(preference: ThemePreference) {
  if (typeof window === 'undefined') return
  const shouldUseDark = preference === 'dark' || (preference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', shouldUseDark)
  window.localStorage.setItem(THEME_STORAGE_KEY, preference)
}

export default function SettingsPage() {
  useMonthData()
  const { profile, setProfile } = useStore()

  const [name, setName] = useState(profile?.full_name || '')
  const [currency, setCurrency] = useState<Currency>(profile?.currency || 'USD')
  const [theme, setTheme] = useState<ThemePreference>('light')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Sync local state with store when profile updates
  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '')
      setCurrency(profile.currency || 'USD')
    }
  }, [profile?.id, profile?.full_name, profile?.currency])

  useEffect(() => {
    setTheme(getThemePreference())
  }, [])

  useEffect(() => {
    if (theme !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyThemePreference('system')
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [theme])

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    try {
      const { data, error } = await supabase.from('profiles').update({
        full_name: name.trim(),
        currency,
      }).eq('id', profile.id).select().single()
      if (error) {
        return
      }
      if (data) {
        setProfile(data)
        applyThemePreference(theme)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This will permanently delete all your data and cannot be undone.')) return
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account preferences"/>

      <div className="max-w-2xl space-y-4 sm:space-y-5">

        {/* Profile */}
        <div className="p-4 sm:p-6 card">
          <h2 className="section-title">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name"/>
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input bg-gray-50 dark:bg-gray-800" value={profile?.email || ''} disabled/>
              <p className="mt-1 text-xs text-gray-400">Email cannot be changed here</p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="p-4 sm:p-6 card">
          <h2 className="section-title">Preferences</h2>
          <div className="space-y-4">
            <label className="label">Currency</label>
            <div>
              <select className="input" value={currency} onChange={e => setCurrency(e.target.value as Currency)}>
                {CURRENCY_OPTIONS.map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-400">Used to format all amounts across the app</p>
            </div>

            <div>
              <label className="label">Theme</label>
              <select className="input" value={theme} onChange={e => setTheme(e.target.value as ThemePreference)}>
                <option value="light">Light mode</option>
                <option value="dark">Dark mode</option>
                <option value="system">Device theme</option>
              </select>
              <p className="mt-1 text-xs text-gray-400">Device theme follows your phone or computer appearance setting</p>
            </div>
          </div>
        </div>

        {/* Plan */}
        <div className="p-4 sm:p-6 card">
          <h2 className="section-title">Plan</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {profile?.plan === 'pro' ? 'Pro plan' : 'Free plan'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {profile?.plan === 'pro' ? 'Full access to all features' : '5 entries per section per month'}
              </p>
            </div>
            {profile?.plan !== 'pro' && (
              <a href="/dashboard/upgrade" className="text-xs btn-primary">Upgrade</a>
            )}
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 btn-primary">
            {saving && <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12"/></svg>}
            {saved ? 'Saved!' : 'Save changes'}
          </button>
        </div>

        {/* Danger zone */}
        <div className="p-6 border-red-100 card dark:border-red-900">
          <h2 className="text-red-500 section-title">Danger zone</h2>
          <p className="mb-4 text-sm text-gray-500">Permanently delete your account and all associated data. This cannot be undone.</p>
          <button onClick={handleDeleteAccount} className="px-4 py-2 text-sm border-red-300 btn-danger dark:border-red-700 rounded-xl">
            Delete my account
          </button>
        </div>
      </div>
    </div>
  )
}
