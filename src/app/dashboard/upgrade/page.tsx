'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/store'
import { useMonthData } from '@/hooks/useMonthData'
import PageHeader from '@/components/PageHeader'
import { CURRENCY_SYMBOLS } from '@/types'
import clsx from 'clsx'
import { motion, type Variants } from 'framer-motion'

const FREE_FEATURES = [
  'Up to 5 entries per section per month',
  'Income, bills, expenses, savings & debt tracking',
  'Transaction tracker',
  'Daily spending view',
  'Global currency support',
  'Google & Apple sign-in',
]

const PRO_FEATURES = [
  'Unlimited entries in all sections',
  'Everything in Free',
  'Month-over-month comparison',
  'CSV export',
  'Priority support',
  'Early access to new features',
]

const PRICES: Record<string, { monthly: number; annual: number }> = {
  AED: { monthly: 18.32, annual: 175.99 },
  AFN: { monthly: 314.75, annual: 3028.99 },
  ALL: { monthly: 54.39, annual: 523.99 },
  AMD: { monthly: 1919.51, annual: 18479.99 },
  ANG: { monthly: 8.99, annual: 86.99 },
  AOA: { monthly: 4128.99, annual: 39749.99 },
  ARS: { monthly: 2499.99, annual: 24099.99 },
  AUD: { monthly: 7.99, annual: 74.99 },
  AWG: { monthly: 8.99, annual: 86.99 },
  AZN: { monthly: 8.49, annual: 81.99 },
  BAM: { monthly: 9.29, annual: 89.99 },
  BBD: { monthly: 10.09, annual: 97.99 },
  BDT: { monthly: 529.99, annual: 5099.99 },
  BGN: { monthly: 9.29, annual: 89.99 },
  BHD: { monthly: 1.88, annual: 18.09 },
  BIF: { monthly: 14299.99, annual: 137999.99 },
  BMD: { monthly: 4.99, annual: 47.99 },
  BND: { monthly: 6.79, annual: 65.99 },
  BOB: { monthly: 34.39, annual: 331.99 },
  BRL: { monthly: 24.79, annual: 239.99 },
  BSD: { monthly: 4.99, annual: 47.99 },
  BTN: { monthly: 414.99, annual: 3999.99 },
  BWP: { monthly: 68.49, annual: 659.99 },
  BZD: { monthly: 10.09, annual: 97.99 },
  CAD: { monthly: 6.79, annual: 65.99 },
  CDF: { monthly: 12499.99, annual: 120499.99 },
  CHE: { monthly: 4.59, annual: 44.99 },
  CHF: { monthly: 4.59, annual: 44.99 },
  CHW: { monthly: 4.59, annual: 44.99 },
  CLF: { monthly: 0.169, annual: 1.63 },
  CLP: { monthly: 4799.99, annual: 46199.99 },
  CNY: { monthly: 36.19, annual: 349.99 },
  COP: { monthly: 19999.99, annual: 192999.99 },
  COU: { monthly: 4.99, annual: 47.99 },
  CRC: { monthly: 2699.99, annual: 26099.99 },
  CUC: { monthly: 4.99, annual: 47.99 },
  CUP: { monthly: 4.99, annual: 47.99 },
  CVE: { monthly: 539.99, annual: 5199.99 },
  CZK: { monthly: 119.99, annual: 1159.99 },
  DJF: { monthly: 889.99, annual: 8599.99 },
  DKK: { monthly: 36.49, annual: 351.99 },
  DOP: { monthly: 279.99, annual: 2699.99 },
  DZD: { monthly: 679.99, annual: 6549.99 },
  EGP: { monthly: 243.99, annual: 2349.99 },
  ERN: { monthly: 74.99, annual: 723.99 },
  ETB: { monthly: 549.99, annual: 5299.99 },
  EUR: { monthly: 4.59, annual: 44.99 },
  FJD: { monthly: 11.29, annual: 108.99 },
  FKP: { monthly: 3.99, annual: 37.99 },
  GBP: { monthly: 3.99, annual: 37.99 },
  GEL: { monthly: 13.49, annual: 129.99 },
  GHS: { monthly: 59.99, annual: 579.99 },
  GIP: { monthly: 3.99, annual: 37.99 },
  GMD: { monthly: 309.99, annual: 2999.99 },
  GNF: { monthly: 42999.99, annual: 414999.99 },
  GTQ: { monthly: 39.49, annual: 381.99 },
  GYD: { monthly: 1044.99, annual: 10099.99 },
  HKD: { monthly: 39.49, annual: 381.99 },
  HNL: { monthly: 123.99, annual: 1199.99 },
  HRK: { monthly: 34.49, annual: 331.99 },
  HTG: { monthly: 687.99, annual: 6629.99 },
  HUF: { monthly: 1749.99, annual: 16899.99 },
  IDR: { monthly: 79449.99, annual: 767199.99 },
  ILS: { monthly: 18.79, annual: 181.99 },
  INR: { monthly: 414.99, annual: 3999.99 },
  IQD: { monthly: 6529.99, annual: 62999.99 },
  IRR: { monthly: 210599.99, annual: 2035999.99 },
  ISK: { monthly: 694.99, annual: 6699.99 },
  JMD: { monthly: 764.99, annual: 7379.99 },
  JOD: { monthly: 3.54, annual: 34.19 },
  JPY: { monthly: 779.99, annual: 7519.99 },
  KES: { monthly: 649.99, annual: 6269.99 },
  KGS: { monthly: 429.99, annual: 4149.99 },
  KHR: { monthly: 20449.99, annual: 197499.99 },
  KMF: { monthly: 2419.99, annual: 23349.99 },
  KPW: { monthly: 4499.99, annual: 43399.99 },
  KRW: { monthly: 6749.99, annual: 65049.99 },
  KWD: { monthly: 1.54, annual: 14.79 },
  KYD: { monthly: 4.19, annual: 40.39 },
  KZT: { monthly: 2249.99, annual: 21699.99 },
  LAK: { monthly: 104499.99, annual: 1008499.99 },
  LBP: { monthly: 149999.99, annual: 1449999.99 },
  LKR: { monthly: 1490.99, annual: 14399.99 },
  LRD: { monthly: 744.99, annual: 7189.99 },
  LSL: { monthly: 94.99, annual: 915.99 },
  LYD: { monthly: 24.49, annual: 236.99 },
  MAD: { monthly: 51.49, annual: 496.99 },
  MDL: { monthly: 89.49, annual: 862.99 },
  MGA: { monthly: 22349.99, annual: 215699.99 },
  MKD: { monthly: 309.99, annual: 2999.99 },
  MMK: { monthly: 10449.99, annual: 100699.99 },
  MNT: { monthly: 16999.99, annual: 163999.99 },
  MOP: { monthly: 40.49, annual: 391.99 },
  MRU: { monthly: 189.99, annual: 1829.99 },
  MUR: { monthly: 219.99, annual: 2119.99 },
  MVR: { monthly: 76.99, annual: 741.99 },
  MWK: { monthly: 4849.99, annual: 46799.99 },
  MXN: { monthly: 84.99, annual: 819.99 },
  MXV: { monthly: 4.99, annual: 47.99 },
  MYR: { monthly: 23.49, annual: 226.99 },
  MZN: { monthly: 317.99, annual: 3069.99 },
  NAD: { monthly: 94.99, annual: 915.99 },
  NGN: { monthly: 7649.99, annual: 73799.99 },
  NIO: { monthly: 181.99, annual: 1754.99 },
  NOK: { monthly: 54.99, annual: 529.99 },
  NPR: { monthly: 659.99, annual: 6359.99 },
  NZD: { monthly: 8.49, annual: 81.99 },
  OMR: { monthly: 1.92, annual: 18.49 },
  PAB: { monthly: 4.99, annual: 47.99 },
  PEN: { monthly: 18.79, annual: 181.99 },
  PGK: { monthly: 18.49, annual: 178.99 },
  PHP: { monthly: 279.99, annual: 2699.99 },
  PKR: { monthly: 1309.99, annual: 12629.99 },
  PLN: { monthly: 21.49, annual: 207.99 },
  PYG: { monthly: 36749.99, annual: 354499.99 },
  QAR: { monthly: 18.19, annual: 175.49 },
  RON: { monthly: 23.49, annual: 226.99 },
  RSD: { monthly: 569.99, annual: 5499.99 },
  RUB: { monthly: 499.99, annual: 4819.99 },
  RWF: { monthly: 6249.99, annual: 60299.99 },
  SAR: { monthly: 18.79, annual: 181.99 },
  SBD: { monthly: 41.99, annual: 404.99 },
  SCR: { monthly: 73.49, annual: 708.99 },
  SDG: { monthly: 2999.99, annual: 28999.99 },
  SEK: { monthly: 54.99, annual: 529.99 },
  SGD: { monthly: 6.79, annual: 65.99 },
  SHP: { monthly: 3.99, annual: 37.99 },
  SLE: { monthly: 1149.99, annual: 11099.99 },
  SLL: { monthly: 114999.99, annual: 1108999.99 },
  SOS: { monthly: 2849.99, annual: 27499.99 },
  SRD: { monthly: 169.99, annual: 1639.99 },
  SSP: { monthly: 649.99, annual: 6269.99 },
  STN: { monthly: 120.99, annual: 1165.99 },
  SYP: { monthly: 12599.99, annual: 121499.99 },
  SZL: { monthly: 94.99, annual: 915.99 },
  THB: { monthly: 179.99, annual: 1735.99 },
  TJS: { monthly: 54.49, annual: 524.99 },
  TMT: { monthly: 17.49, annual: 168.99 },
  TND: { monthly: 16.49, annual: 159.99 },
  TOP: { monthly: 11.99, annual: 115.99 },
  TRY: { monthly: 149.99, annual: 1449.99 },
  TTD: { monthly: 33.99, annual: 327.99 },
  TWD: { monthly: 159.99, annual: 1539.99 },
  TZS: { monthly: 11649.99, annual: 112299.99 },
  UAH: { monthly: 183.99, annual: 1773.99 },
  UGX: { monthly: 18449.99, annual: 177999.99 },
  USD: { monthly: 4.99, annual: 47.99 },
  USN: { monthly: 4.99, annual: 47.99 },
  UYI: { monthly: 4.99, annual: 47.99 },
  UYU: { monthly: 189.99, annual: 1829.99 },
  UYW: { monthly: 189.99, annual: 1829.99 },
  UZS: { monthly: 59499.99, annual: 573999.99 },
  VED: { monthly: 84999.99, annual: 819999.99 },
  VES: { monthly: 169.99, annual: 1639.99 },
  VND: { monthly: 125999.99, annual: 1214999.99 },
  VUV: { monthly: 599.99, annual: 5789.99 },
  WST: { monthly: 13.99, annual: 134.99 },
  XAF: { monthly: 3249.99, annual: 31349.99 },
  XAG: { monthly: 0.15, annual: 1.49 },
  XAU: { monthly: 0.0024, annual: 0.024 },
  XBA: { monthly: 4.99, annual: 47.99 },
  XBB: { monthly: 4.99, annual: 47.99 },
  XBC: { monthly: 4.99, annual: 47.99 },
  XBD: { monthly: 4.99, annual: 47.99 },
  XCD: { monthly: 13.49, annual: 129.99 },
  XDR: { monthly: 3.99, annual: 38.99 },
  XOF: { monthly: 3249.99, annual: 31349.99 },
  XPD: { monthly: 0.003, annual: 0.029 },
  XPF: { monthly: 569.99, annual: 5499.99 },
  XPT: { monthly: 0.003, annual: 0.029 },
  XSU: { monthly: 4.99, annual: 47.99 },
  XTS: { monthly: 4.99, annual: 47.99 },
  XUA: { monthly: 4.99, annual: 47.99 },
  XXX: { monthly: 4.99, annual: 47.99 },
  YER: { monthly: 1249.99, annual: 12049.99 },
  ZAR: { monthly: 94.99, annual: 915.99 },
  ZMW: { monthly: 99.99, annual: 964.99 },
  ZWL: { monthly: 1599.99, annual: 15399.99 },
}

export default function UpgradePage() {
  useMonthData()
  const { profile, getCurrency } = useStore()
  const currency = getCurrency()
  const isPro = profile?.plan === 'pro'
  const price = PRICES[currency] || PRICES.USD
  const sym = CURRENCY_SYMBOLS[currency]
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const [statusLoading, setStatusLoading] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    status: string
    cancelAtPeriodEnd: boolean
    currentPeriodEnd: string | null
  } | null>(null)

  useEffect(() => {
    const loadSubscriptionStatus = async () => {
      if (!isPro) {
        setSubscriptionStatus(null)
        return
      }

      setStatusLoading(true)
      try {
        const res = await fetch('/api/stripe/subscription-status', { method: 'GET' })
        const data = await res.json()
        if (!res.ok || data?.status === 'none') {
          setSubscriptionStatus(null)
          return
        }

        setSubscriptionStatus({
          status: data.status,
          cancelAtPeriodEnd: Boolean(data.cancelAtPeriodEnd),
          currentPeriodEnd: data.currentPeriodEnd || null,
        })
      } catch {
        setSubscriptionStatus(null)
      } finally {
        setStatusLoading(false)
      }
    }

    loadSubscriptionStatus()
  }, [isPro])

  const handleUpgrade = async () => {
    setCheckoutError('')
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billing, currency }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to start checkout')
      }
      if (data.url) {
        window.location.href = data.url
        return
      }
      throw new Error('No checkout URL returned')
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to start checkout'
      setCheckoutError(message)
    }
    setCheckoutLoading(false)
  }

  const handleManageSubscription = async () => {
    setCheckoutError('')
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to open billing portal')
      }
      if (data.url) {
        window.location.href = data.url
        return
      }
      throw new Error('No billing portal URL returned')
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to open billing portal'
      setCheckoutError(message)
    }
    setPortalLoading(false)
  }

  const cardAnim: Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] } } }

  return (
    <div>
      <PageHeader title="Plans" subtitle="Simple, transparent pricing"/>

      {isPro && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl p-4 flex items-start gap-3"
          style={{ background: 'linear-gradient(135deg,rgba(107,92,230,0.1),rgba(234,92,132,0.08))', border: '1px solid rgba(107,92,230,0.25)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b5ce6" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between w-full gap-2">
            <div>
              {!statusLoading && subscriptionStatus && (
                <p className="text-xs sm:text-sm text-brand-700 dark:text-brand-300">
                  {subscriptionStatus.cancelAtPeriodEnd
                    ? 'Your Pro plan is set to cancel at period end.'
                    : 'Your Pro plan is active and will renew automatically.'}
                </p>
              )}
              {!statusLoading && subscriptionStatus?.currentPeriodEnd && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {subscriptionStatus.cancelAtPeriodEnd
                    ? 'Access ends on '
                    : 'Next billing date: '}
                  {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
            <button
              onClick={handleManageSubscription}
              disabled={portalLoading}
              className="btn-secondary text-xs sm:text-sm"
            >
              {portalLoading ? 'Opening portal...' : 'Manage subscription'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Billing toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex p-1 rounded-xl" style={{ background: '#f3f1fd' }}>
          {(['monthly','annual'] as const).map(b => (
            <button key={b} onClick={() => setBilling(b)}
              className="px-5 py-2 text-sm rounded-lg font-semibold transition-all"
              style={billing === b ? { background: 'linear-gradient(135deg,#6b5ce6,#ea5c84)', color: 'white', boxShadow: '0 2px 12px rgba(107,92,230,0.3)' } : { color: '#9896b8' }}
            >
              {b === 'monthly' ? 'Monthly' : 'Annual'}
              {b === 'annual' && <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full" style={billing === 'annual' ? { background: 'rgba(255,255,255,0.2)' } : { background: '#ea5c84', color: 'white' }}>Save 20%</span>}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        initial="hidden" animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl"
      >
        {/* Free plan */}
        <motion.div variants={cardAnim} className="card p-4 sm:p-6">
          <div className="mb-5">
            <span className="badge-free mb-3 block w-fit">Free</span>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{sym}0</div>
            <div className="text-xs sm:text-sm text-gray-400 mt-1">Forever free</div>
          </div>
          <ul className="space-y-2 sm:space-y-3 mb-6">
            {FREE_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b5ce6" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {f}
              </li>
            ))}
          </ul>
          <button disabled className="w-full py-2.5 text-sm font-medium text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl cursor-default">
            {!isPro ? 'Current plan' : 'Free plan'}
          </button>
        </motion.div>

        {/* Pro plan */}
        <motion.div variants={cardAnim} className="card p-4 sm:p-6 relative" style={{ border: '2px solid #6b5ce6' }}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="text-white text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'linear-gradient(135deg,#6b5ce6,#ea5c84)' }}>Most popular</span>
          </div>
          <div className="mb-5">
            <span className="badge-pro mb-3 inline-flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Pro
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {sym}{billing === 'monthly' ? price.monthly : (price.annual / 12).toFixed(2)}
              <span className="text-xs sm:text-sm font-normal text-gray-400 ml-1">/month</span>
            </div>
            <div className="text-xs sm:text-sm mt-1" style={{ color: '#6b5ce6' }}>
              {billing === 'annual'
                ? `Billed ${sym}${price.annual}/year — save ${Math.round((1 - price.annual / (price.monthly * 12)) * 100)}%`
                : `or ${sym}${price.annual}/year — save ${Math.round((1 - price.annual / (price.monthly * 12)) * 100)}%`}
            </div>
          </div>
          <ul className="space-y-2 sm:space-y-3 mb-6">
            {PRO_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea5c84" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {f}
              </li>
            ))}
          </ul>
          {isPro ? (
            <button disabled className="w-full py-2.5 text-xs sm:text-sm font-medium rounded-xl cursor-default" style={{ color: '#6b5ce6', border: '1px solid #a99af3' }}>
              Current plan
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpgrade}
              disabled={checkoutLoading}
              className="w-full btn-primary py-2.5 sm:py-3 text-xs sm:text-base flex items-center justify-center gap-2"
              style={{ boxShadow: '0 4px 20px rgba(107,92,230,0.35)' }}
            >
              {checkoutLoading ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              )}
              Upgrade to Pro
            </motion.button>
          )}
        </motion.div>
      </motion.div>

      <p className="text-xs text-gray-400 mt-6 max-w-2xl">
        Payment processing via Stripe. Cancel anytime — no questions asked. Your data is always yours and will never be sold.
      </p>
      {checkoutError && (
        <p className="mt-3 text-xs text-red-500 bg-red-50 dark:bg-red-950/40 dark:text-red-300 rounded-lg px-3 py-2 inline-block">
          {checkoutError}
        </p>
      )}
    </div>
  )
}
