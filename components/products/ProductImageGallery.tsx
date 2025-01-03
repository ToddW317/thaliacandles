'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImageGalleryProps {
  images: string[]
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  // Show placeholder if no images
  if (!images?.length) {
    return (
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No image available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
        <Image
          src={images[selectedImage]}
          alt="Product image"
          width={800}
          height={800}
          className="h-full w-full object-cover object-center"
          priority
        />
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-h-1 aspect-w-1 overflow-hidden rounded-lg ${
                selectedImage === index ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              <Image
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                width={200}
                height={200}
                className="h-full w-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 