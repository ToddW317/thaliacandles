import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import ProductCard from '@/components/products/ProductCard'
import { Product } from '@/types'

async function getProducts() {
  const productsRef = collection(db, 'products')
  const snapshot = await getDocs(productsRef)
  return snapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      images: data.images || []
    }
  }) as Product[]
}

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Shop All Candles</h1>
          <p className="mt-2 text-lg text-gray-600">
            Browse our complete collection of handcrafted candles
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                href={`/shop/${product.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 