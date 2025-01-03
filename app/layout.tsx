import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { AuthProvider } from '@/providers/auth'
import Header from "@/components/layout/Header"
import LayoutWrapper from "@/components/layout/LayoutWrapper"

const inter = Inter({ subsets: ["latin"] })
const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  title: "Thalia's Candles | Handmade with Love",
  description: "Discover our handcrafted candles made with natural ingredients",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable} min-h-screen flex flex-col`}>
        <AuthProvider>
          <Header />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  )
} 