import Link from 'next/link'

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-playfair font-bold mb-4">Thank You for Your Order!</h1>
      <p className="text-gray-600 mb-8">
        We'll send you an email confirmation with your order details shortly.
      </p>
      <Link
        href="/shop"
        className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  )
} 