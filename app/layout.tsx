import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'تطبيق حساب الأوزان - Weight Precision',
  description: 'تطبيق لتخزين وحساب الأوزان بدقة عالية',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
