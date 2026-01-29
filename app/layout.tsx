import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'
import Providers  from './providers'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700']
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'StartupDeals - Exclusive Benefits for Startups',
  description: 'Access exclusive deals and benefits on premium SaaS tools. Save thousands on cloud services, marketing tools, and productivity software.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="font-body antialiased bg-slate-950 text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}