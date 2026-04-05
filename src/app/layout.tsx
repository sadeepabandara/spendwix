import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { Plus_Jakarta_Sans } from 'next/font/google'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SpendWix — Budget Tracker',
  description: 'Track your income, bills, expenses, savings and debt — all in one place.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var key='spendwix:theme';var pref=localStorage.getItem(key);if(pref!=='light'&&pref!=='dark'&&pref!=='system'){pref='light';}var dark=pref==='dark'||(pref==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',dark);}catch(e){}})();`}
        </Script>
      </head>
      <body className={`${plusJakarta.className} bg-gray-50 text-gray-900 dark:bg-[#0b1020] dark:text-gray-100 transition-colors duration-300`}>{children}</body>
    </html>
  )
}
