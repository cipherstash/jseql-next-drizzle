import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

export const metadata: Metadata = {
  title: 'jseql-next-drizzle',
  description: 'An example of using jseql with Next.js and Drizzle ORM',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <main>{children}</main>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
