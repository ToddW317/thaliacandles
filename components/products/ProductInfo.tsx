'use client'

import { Product } from '@/types'

interface ProductInfoProps {
  product: Product
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{product.name}</h1>
        <p className="mt-3 text-3xl text-gray-900">${product.price.toFixed(2)}</p>
      </div>

      <div className="mt-4">
        <h2 className="text-sm font-medium text-gray-900">Description</h2>
        <p className="mt-2 text-gray-600">{product.description}</p>
      </div>

      {/* Additional product details */}
      {(product.scent || product.burnTime || product.weight) && (
        <div className="mt-8 border-t border-gray-200 pt-8">
          <h2 className="text-sm font-medium text-gray-900">Product Details</h2>
          <dl className="mt-4 space-y-4">
            {product.scent && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Scent</dt>
                <dd className="mt-1 text-sm text-gray-900">{product.scent}</dd>
              </div>
            )}
            {product.burnTime && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Burn Time</dt>
                <dd className="mt-1 text-sm text-gray-900">{product.burnTime}</dd>
              </div>
            )}
            {product.weight && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Weight</dt>
                <dd className="mt-1 text-sm text-gray-900">{product.weight}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  )
} 