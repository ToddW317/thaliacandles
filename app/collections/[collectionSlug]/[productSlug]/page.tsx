import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { notFound } from 'next/navigation'
import ProductImageGallery from '@/components/products/ProductImageGallery'
import ProductInfo from '@/components/products/ProductInfo'
import { Product } from '@/types'
import { use } from 'react'

async function getProductData(productSlug: string) {
  const productsRef = collection(db, 'products')
  const productsSnapshot = await getDocs(productsRef)
  const productDoc = productsSnapshot.docs.find(doc => {
    const data = doc.data()
    return data.name.toLowerCase().replace(/\s+/g, '-') === productSlug
  })

  if (!productDoc) {
    return null
  }

  return {
    id: productDoc.id,
    ...productDoc.data()
  } as Product
}

export default function ProductPage({ 
  params 
}: { 
  params: { collectionSlug: string; productSlug: string } 
}) {
  const product = use(getProductData(params.productSlug))

  if (!product) {
    return notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ProductImageGallery images={product.images} />
        <ProductInfo product={product} />
      </div>

      {/* ... rest of the product details ... */}
    </div>
  )
} 