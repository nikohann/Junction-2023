import { Metadata } from 'next'

import { Toaster } from 'react-hot-toast'

import '@/app/globals.css'
import { cn } from '@/lib/utils'
import { NextUIProvider } from '@nextui-org/react'

export const metadata: Metadata = {
  title: {
    default: 'Next.js AI Chatbot',
    template: `%s - Next.js AI Chatbot`
  },
  description: 'An AI-powered chatbot template built with Next.js and Vercel.',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
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
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'font-sans antialiased',
        )}
      >
        <Toaster />
        <NextUIProvider>
          <div className="flex flex-col min-h-screen">
            {/* @ts-ignore */}
            <Chatbar />
            <main className="flex flex-col flex-1 bg-muted/50">{children}</main>
          </div>
        </NextUIProvider>
      </body>
    </html>
  )
}
