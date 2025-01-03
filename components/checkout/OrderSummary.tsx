import { CartItem } from '@/types/cart'
import Image from 'next/image'

interface OrderSummaryProps {
  items: CartItem[]
  total: number
}

export default function OrderSummary({ items, total }: OrderSummaryProps) {
  const subtotal = total
  const shipping = 5.99
  const tax = subtotal * 0.08 // 8% tax
  const finalTotal = subtotal + shipping + tax

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <div key={item.id} className="py-4 flex gap-4">
            <div className="w-20 h-20 relative rounded-md overflow-hidden">
              <Image
                src={item.product.images[0].url}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{item.product.name}</h3>
              <p className="text-sm text-gray-500">{item.variant.size}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">${(item.variant.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 mt-6 pt-6 space-y-4">
        <div className="flex justify-between text-sm">
          <p>Subtotal</p>
          <p>${subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-sm">
          <p>Shipping</p>
          <p>${shipping.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-sm">
          <p>Tax</p>
          <p>${tax.toFixed(2)}</p>
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <p>Total</p>
          <p>${finalTotal.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
} 