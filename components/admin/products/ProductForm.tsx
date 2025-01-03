'use client'

import { useState } from 'react'
import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { Product } from '@/types'

interface ProductFormProps {
  initialProduct?: Product
  onSubmit: (product: Product) => Promise<void>
}

export default function ProductForm({ initialProduct, onSubmit }: ProductFormProps) {
  const [product, setProduct] = useState<Product>(initialProduct || {
    name: '',
    description: '',
    price: 0,
    images: [],
  } as Product)
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true)
      
      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, `products/${file.name}-${Date.now()}`)
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file)
      
      // Get the download URL - this is important!
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      // Add the URL to your product images array
      setProduct(prev => ({
        ...prev,
        images: [...(prev.images || []), downloadURL]
      }))
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(product)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product Images
        </label>
        <div className="mt-1 flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImageUpload(file)
            }}
            disabled={uploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
          {uploading && <span>Uploading...</span>}
        </div>
        {/* Display uploaded images */}
        <div className="mt-4 grid grid-cols-4 gap-4">
          {product.images?.map((url, index) => (
            <div key={url} className="relative">
              <img
                src={url}
                alt={`Product image ${index + 1}`}
                className="h-24 w-24 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => {
                  setProduct(prev => ({
                    ...prev,
                    images: prev.images.filter(img => img !== url)
                  }))
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Other form fields */}
      
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Save Product
      </button>
    </form>
  )
} 