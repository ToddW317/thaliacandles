'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db } from '@/lib/firebase'
import { Collection } from '@/types'
import ProductList from '@/components/admin/collections/ProductList'
import CollectionHero from '@/components/admin/collections/CollectionHero'
import CollectionSettings from '@/components/admin/collections/CollectionSettings'

export default function CollectionDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [activeTab, setActiveTab] = useState('products')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCollection()
  }, [params.id])

  const fetchCollection = async () => {
    try {
      const docRef = doc(db, 'collections', params.id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        setCollection({
          id: docSnap.id,
          ...docSnap.data()
        } as Collection)
      }
    } catch (error) {
      console.error('Error fetching collection:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCollection = async (data: Partial<Collection>) => {
    if (!collection) return

    try {
      let imageUrl = collection.image

      // Handle image upload if there's a new image
      if (data.image instanceof File) {
        const storage = getStorage()
        const imageRef = ref(storage, `collections/${Date.now()}-${data.image.name}`)
        await uploadBytes(imageRef, data.image)
        imageUrl = await getDownloadURL(imageRef)
      }

      const updateData = {
        ...data,
        image: imageUrl,
      }

      await updateDoc(doc(db, 'collections', collection.id), updateData)
      await fetchCollection()
    } catch (error) {
      console.error('Error updating collection:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!collection) {
    return <div>Collection not found</div>
  }

  return (
    <div className="space-y-6">
      <CollectionHero collection={collection} onUpdate={handleUpdateCollection} />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`${
              activeTab === 'products'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`${
              activeTab === 'settings'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'products' ? (
        <ProductList collectionId={collection.id} />
      ) : (
        <CollectionSettings collection={collection} onUpdate={handleUpdateCollection} />
      )}
    </div>
  )
} 