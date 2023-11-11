import { Metadata } from 'next'

import '@/app/globals.css'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: {
    default: 'Next.js AI Chatbot',
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
      <body className="h-screen text-foreground bg-background font-sans antialiased bg-gradient-to-r from-primary-100 via-secondary-50">
        <Providers>
          <main className="flex flex-col flex-1 bg-muted/50">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
