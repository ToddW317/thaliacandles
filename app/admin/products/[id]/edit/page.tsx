'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import ProductForm from '@/components/admin/ProductForm'

interface Product {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
  stock: number
}

export default function EditProduct() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, 'products', params.id as string))
        if (productDoc.exists()) {
          setProduct({
            id: productDoc.id,
            ...productDoc.data()
          } as Product)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Product</h1>
        <p className="mt-1 text-sm text-gray-600">
          Update the product information using the form below.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <ProductForm initialData={product} />
      </div>
    </div>
  )
} 