import { Metadata } from 'next'

import '@/app/globals.css'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: {
    default: 'IntelliMetal',
    template: `%s - Next.js AI Chatbot`
  },
  description: 'An AI-powered chatbot template built with Next.js and Vercel.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head />
      <body className="min-h-screen text-foreground bg-background font-sans antialiased bg-gradient-to-br from-primary-200 via-secondary-200 z-50">
        <Providers>
          <main className="flex flex-col flex-1 bg-muted/50">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
