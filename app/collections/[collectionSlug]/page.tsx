import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import ProductCard from '@/components/products/ProductCard'
import { Product } from '@/types'
import { use } from 'react'

async function getCollectionData(collectionSlug: string) {
  // First get the collection document
  const collectionsRef = collection(db, 'collections')
  const collectionsSnapshot = await getDocs(collectionsRef)
  const collectionDoc = collectionsSnapshot.docs.find(doc => 
    doc.data().name.toLowerCase().replace(/\s+/g, '-') === collectionSlug
  )

  if (!collectionDoc) {
    return null
  }

  const collectionName = collectionDoc.data().name

  // Then get all products in this collection
  const productsRef = collection(db, 'products')
  const q = query(productsRef, where('collectionId', '==', collectionDoc.id))
  const productsSnapshot = await getDocs(q)
  
  const products = productsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[]

  return { collectionName, products }
}

export default function CollectionPage({ 
  params 
}: { 
  params: { collectionSlug: string } 
}) {
  const data = use(getCollectionData(params.collectionSlug))

  if (!data) {
    return <div>Collection not found</div>
  }

  const { collectionName, products } = data

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-playfair font-bold mb-8">{collectionName}</h1>
      
      {products.length === 0 ? (
        <p className="text-gray-500">No products in this collection yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map(product => {
            const productSlug = product.name.toLowerCase().replace(/\s+/g, '-')
            return (
              <ProductCard 
                key={product.id}
                product={product}
                href={`/collections/${params.collectionSlug}/${productSlug}`}
              />
            )
          })}
        </div>
      )}
    </div>
  )
} 