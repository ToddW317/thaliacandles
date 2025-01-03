'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useCartStore from '@/store/cartStore'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import OrderSummary from '@/components/checkout/OrderSummary'

export default function CheckoutPage() {
  const { items, total } = useCartStore()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  if (items.length === 0) {
    router.push('/shop')
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-playfair font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <CheckoutForm isProcessing={isProcessing} setIsProcessing={setIsProcessing} />
        <OrderSummary items={items} total={total} />
      </div>
    </div>
  )
} 