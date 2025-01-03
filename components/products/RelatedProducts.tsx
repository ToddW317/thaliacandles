import { Product } from '@/types/product'
import ProductCard from '@/components/shop/ProductCard'

interface RelatedProductsProps {
  collectionId: string
  currentProductId: string
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ collectionId, currentProductId }) => {
  // This will be replaced with actual data fetching
  const relatedProducts: Product[] = [
    {
      id: 'lavender-dreams',
      name: 'Lavender Dreams',
      description: 'Calming lavender with hints of vanilla and chamomile.',
      images: [
        { id: '1', url: '/images/products/lavender-1.jpg', alt: 'Lavender Dreams Candle' }
      ],
      price: 24.99,
      variants: [
        { id: '1', size: '4 oz', price: 14.99, inStock: true },
        { id: '2', size: '8 oz', price: 24.99, inStock: true }
      ],
      scent: 'Lavender & Vanilla',
      burnTime: '40-45 hours',
      weight: '8 oz',
      ingredients: ['Soy wax', 'Cotton wick', 'Essential oils'],
      collectionId: 'classic'
    },
    {
      id: 'ocean-breeze',
      name: 'Ocean Breeze',
      description: 'Fresh sea salt and ocean air captured in a luxurious candle.',
      images: [
        { id: '1', url: '/images/products/ocean-1.jpg', alt: 'Ocean Breeze Candle' }
      ],
      price: 24.99,
      variants: [
        { id: '1', size: '4 oz', price: 14.99, inStock: true },
        { id: '2', size: '8 oz', price: 24.99, inStock: true }
      ],
      scent: 'Sea Salt & Air',
      burnTime: '40-45 hours',
      weight: '8 oz',
      ingredients: ['Soy wax', 'Cotton wick', 'Essential oils'],
      collectionId: 'classic'
    }
  ].filter(product => product.id !== currentProductId)

  if (relatedProducts.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-playfair font-bold mb-8">You May Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default RelatedProducts 