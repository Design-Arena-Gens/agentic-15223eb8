import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Urbanweb Task Scheduler',
  description: 'Modern task management for creative teams',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
