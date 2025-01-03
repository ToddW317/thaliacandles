import Link from 'next/link'
import Image from 'next/image'
import { Collection } from '@/types'

interface CollectionCardProps {
  collection: Collection
  index: number
}

export default function CollectionCard({ collection, index }: CollectionCardProps) {
  // Create URL-friendly slug from collection name
  const collectionSlug = collection.name.toLowerCase().replace(/\s+/g, '-')

  return (
    <Link 
      href={`/collections/${collectionSlug}`}
      className="group relative block h-64 overflow-hidden rounded-lg bg-gray-100"
    >
      {collection.image ? (
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        // Fallback image or placeholder
        <div className="flex h-full items-center justify-center bg-gray-200">
          <span className="text-gray-400">No image available</span>
        </div>
      )}
      <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity group-hover:bg-opacity-30">
        <div className="flex h-full flex-col justify-end p-6">
          <h3 className="text-xl font-semibold text-white">{collection.name}</h3>
          {collection.description && (
            <p className="mt-2 text-sm text-gray-200">{collection.description}</p>
          )}
          {collection.productCount !== undefined && (
            <p className="mt-2 text-sm text-gray-300">
              {collection.productCount} {collection.productCount === 1 ? 'product' : 'products'}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
} 