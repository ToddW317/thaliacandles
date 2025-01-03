'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import CollectionCard from '@/components/home/CollectionCard'

interface Collection {
  id: string
  name: string
  description: string
  image?: string
  productCount?: number
  featured?: boolean
}

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'collections'))
        const collectionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Collection[]
        setCollections(collectionsData)
      } catch (error) {
        console.error('Error fetching collections:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-playfair font-bold mb-8">Our Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {collections.map((collection, index) => (
          <CollectionCard 
            key={collection.id}
            collection={collection}
            index={index}
          />
        ))}
      </div>
    </div>
  )
} 