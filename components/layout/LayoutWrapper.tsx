'use client'

import { usePathname } from 'next/navigation'
import Footer from "@/components/layout/Footer"
import CartSidebar from '@/components/cart/CartSidebar'

export default function LayoutWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const isAdminRoute = usePathname()?.startsWith('/admin')

  return (
    <>
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
      <CartSidebar />
    </>
  )
} 