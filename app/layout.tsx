import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Recette - Your Personal Recipe Collection',
  description: 'Save, organize, and share your favorite recipes',
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
