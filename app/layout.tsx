import type { Metadata } from 'next'
import { Noto_Sans_Arabic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AnalyticsInit } from '@/components/analytics-init'
import { Providers } from './providers'

const notoArabic = Noto_Sans_Arabic({ 
  subsets: ["arabic"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic'
});

export const metadata: Metadata = {
  title: 'تونس الرقمية : رحلة في قلب الخريطة',
  description: 'تطبيق تعليمي تفاعلي لمادة الجغرافيا - السنة السادسة ابتدائي',

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${notoArabic.className} antialiased`}>
        <AnalyticsInit />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
