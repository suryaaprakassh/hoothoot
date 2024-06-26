import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import ToastProvider from '@/components/providers'
import UserContextProvider from '@/components/authProviders'
import { SocketProvider } from '@/components/SocketProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className + " dark"}>
        <ToastProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
