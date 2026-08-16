import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'
import type React from 'react'
import Providers from './providers'
import '../styles/globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})

export const metadata: Metadata = {
  title: 'Fullstack Basic Starter',
  description: 'Next.js 16 + Fastify 5 fullstack starter'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()

  // `NextIntlClientProvider` inherits locale, messages and formats from
  // `i18n/request.ts` on its own since next-intl 4 — no need to pass them.
  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
