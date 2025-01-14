import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Caffeine Beast 🔥',
  description: 'Track your caffeine intake like a boss! ⚡️',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <div className="container mx-auto px-4 max-w-md">
          {children}
        </div>
      </body>
    </html>
  )
}

