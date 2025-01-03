'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
  href: string
}

export default function ProductCard({ product, href }: ProductCardProps) {
  const imageUrl = product.images?.[0] || '/images/placeholder.jpg'

  return (
    <Link href={href} className="group">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={product.name}
          width={500}
          height={500}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
          priority
        />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{product.name}</h3>
      <p className="mt-1 text-sm text-gray-500">${product.price.toFixed(2)}</p>
    </Link>
  )
} 