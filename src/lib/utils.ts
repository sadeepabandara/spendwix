import { Currency, CURRENCY_SYMBOLS } from '@/types'

export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency]
  const abs = Math.abs(amount)
  const formatted = abs >= 1000
    ? abs.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    : abs.toFixed(2)
  return amount < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`
}

export function formatDiff(diff: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency]
  const abs = Math.abs(diff)
  const formatted = abs.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  return diff >= 0 ? `+${symbol}${formatted}` : `-${symbol}${formatted}`
}

export function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function getMonthLabel(month: string): string {
  const [year, mon] = month.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[parseInt(mon) - 1]} ${year}`
}

export function getLast12Months(): string[] {
  const result: string[] = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  return result
}

export function getDaysInMonth(month: string): string[] {
  const [year, mon] = month.split('-').map(Number)
  const days = new Date(year, mon, 0).getDate()
  return Array.from({ length: days }, (_, i) =>
    `${month}-${String(i + 1).padStart(2, '0')}`
  )
}

export function pct(actual: number, budget: number): number {
  if (!budget) return 0
  return Math.min(100, Math.round((actual / budget) * 100))
}
