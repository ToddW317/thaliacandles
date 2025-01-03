import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { notFound } from 'next/navigation'
import ProductImageGallery from '@/components/products/ProductImageGallery'
import ProductInfo from '@/components/products/ProductInfo'
import { Product } from '@/types'

export default async function ProductPage({ 
  params 
}: { 
  params: { productId: string } 
}) {
  // Get the product data
  const docRef = doc(db, 'products', params.productId)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) {
    notFound()
  }

  const product = {
    id: docSnap.id,
    ...docSnap.data()
  } as Product

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
        <ProductImageGallery images={product.images || []} />
        <ProductInfo product={product} />
      </div>
    </div>
  )
} 