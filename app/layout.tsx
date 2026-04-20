import type { Metadata } from 'next'
import { ChatWidgetWrapper } from '@/components/ChatWidgetWrapper'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://keceoil.com'),
  title: {
    default: 'KeceoOil — Premium Red Palm Oil | Wholesale & Retail in Nigeria',
    template: '%s | KeceoOil',
  },
  description:
    'Buy premium, locally-sourced red palm oil in Nigeria. Food-grade certified, wholesale pricing from ₦9,500. 3L to 100L sizes. Fast delivery to Lagos, Abuja & nationwide. Order via WhatsApp.',
  keywords: [
    'red palm oil',
    'palm oil Nigeria',
    'buy palm oil online',
    'wholesale palm oil',
    'KeceoOil',
    'food grade palm oil',
    'bulk palm oil Lagos',
    'palm oil Abuja',
    'organic palm oil',
    'cold pressed palm oil',
    'palm oil delivery Nigeria',
  ],
  authors: [{ name: 'KeceoOil' }],
  creator: 'KeceoOil',
  publisher: 'KeceoOil',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://keceoil.com',
    siteName: 'KeceoOil',
    title: 'KeceoOil — Premium Red Palm Oil | Wholesale & Retail in Nigeria',
    description:
      'Buy premium red palm oil. Food-grade certified, from ₦9,500. 3L–100L sizes with fast delivery across Nigeria.',
    images: [
      {
        url: 'https://res.cloudinary.com/detpqzhnq/image/upload/q_auto/f_auto/v1776640671/download_2_a0a1og.png',
        width: 1200,
        height: 630,
        alt: 'KeceoOil — Premium Red Palm Oil',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KeceoOil — Premium Red Palm Oil in Nigeria',
    description:
      'Food-grade certified red palm oil. Wholesale & retail from ₦9,500. Fast delivery nationwide.',
    images: [
      'https://res.cloudinary.com/detpqzhnq/image/upload/q_auto/f_auto/v1776640671/download_2_a0a1og.png',
    ],
  },
  alternates: {
    canonical: 'https://keceoil.com',
  },
  icons: {
    icon: [
      {
        url: 'https://res.cloudinary.com/detpqzhnq/image/upload/q_auto/f_auto/w_32,h_32,c_fill/v1776681497/download_5_qdevvi.webp',
        sizes: '32x32',
        type: 'image/webp',
      },
      {
        url: 'https://res.cloudinary.com/detpqzhnq/image/upload/q_auto/f_auto/w_16,h_16,c_fill/v1776681497/download_5_qdevvi.webp',
        sizes: '16x16',
        type: 'image/webp',
      },
    ],
    apple: 'https://res.cloudinary.com/detpqzhnq/image/upload/q_auto/f_auto/w_180,h_180,c_fill/v1776681497/download_5_qdevvi.webp',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'KeceoOil',
              url: 'https://keceoil.com',
              logo: 'https://res.cloudinary.com/detpqzhnq/image/upload/q_auto/f_auto/v1776681497/download_5_qdevvi.webp',
              description:
                'Premium red palm oil wholesale and retail in Nigeria. Food-grade certified, fast delivery.',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+234-812-345-6789',
                contactType: 'sales',
                availableLanguage: ['English'],
              },
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'NG',
              },
              sameAs: ['https://wa.me/2348123456789'],
            }),
          }}
        />
        {children}
        <ChatWidgetWrapper />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
