import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
  isReversed?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isReversed = false }) => {
  return (
    <Link 
      href={`/shop/${product.id}`}
      className="group block"
    >
      <div className="relative aspect-square mb-4">
        <Image
          src={product.images[0].url}
          alt={product.name}
          fill
          className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="font-semibold mb-1">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-2">{product.scent}</p>
      <p className="font-medium">From ${product.variants[0].price.toFixed(2)}</p>
    </Link>
  )
}

export default ProductCard 