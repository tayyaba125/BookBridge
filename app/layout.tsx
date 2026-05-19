import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BookBridge — Not all who wander the shelves are lost.',
  description: 'Discover books, read reviews, and buy from Amazon or Flipkart — all in one place.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
