import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { Plus_Jakarta_Sans } from 'next/font/google'

const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'http://localhost:3000'
const siteUrl = (appUrl.startsWith('http://') || appUrl.startsWith('https://') ? appUrl : `https://${appUrl}`).replace(/\/$/, '')

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SpendWix | Budget Tracker',
    template: '%s | SpendWix',
  },
  description: 'Track your income, bills, expenses, savings and debt — all in one place.',
  applicationName: 'SpendWix',
  keywords: ['budget tracker', 'expense tracker', 'personal finance', 'monthly budget', 'money management'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'SpendWix | Budget Tracker',
    description: 'Track your income, bills, expenses, savings and debt — all in one place.',
    siteName: 'SpendWix',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'SpendWix logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpendWix | Budget Tracker',
    description: 'Track your income, bills, expenses, savings and debt — all in one place.',
    images: ['/icon.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
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
