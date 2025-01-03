'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { PlusIcon, PencilIcon, TrashIcon, HomeIcon } from '@heroicons/react/24/outline'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import Link from "next/link"

interface Collection {
  id: string
  name: string
  description?: string
}

interface CollectionFormData {
  name: string
  description: string
  image?: File
}

export default function CollectionsPage() {
  const router = useRouter()
  const { user, loading, isAdmin } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [collections, setCollections] = useState<Collection[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CollectionFormData>({
    name: '',
    description: ''
  })
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      console.log('Not authenticated or not admin, redirecting...')
      router.push('/auth/signin')
    }
  }, [user, loading, isAdmin, router])

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    const snapshot = await getDocs(collection(db, 'collections'))
    const collectionsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Collection[]
    setCollections(collectionsData)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let imageUrl = ''
      
      // Upload image if exists
      if (formData.image) {
        const storage = getStorage()
        const imageRef = ref(storage, `collections/${Date.now()}-${formData.image.name}`)
        await uploadBytes(imageRef, formData.image)
        imageUrl = await getDownloadURL(imageRef)
      }

      const collectionData = {
        name: formData.name,
        description: formData.description,
        image: imageUrl
      }

      if (editingId) {
        await updateDoc(doc(db, 'collections', editingId), collectionData)
      } else {
        await addDoc(collection(db, 'collections'), collectionData)
      }

      setFormData({ name: '', description: '' })
      setImagePreview('')
      setIsAdding(false)
      setEditingId(null)
      fetchCollections()
    } catch (error) {
      console.error('Error saving collection:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        await deleteDoc(doc(db, 'collections', id))
        fetchCollections()
      } catch (error) {
        console.error('Error deleting collection:', error)
      }
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Loading...</div>
    </div>
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Collections</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Collection
        </button>
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Collection Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Collection Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false)
                  setEditingId(null)
                  setFormData({ name: '', description: '' })
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                {editingId ? 'Update' : 'Create'} Collection
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white shadow-sm rounded-lg">
        <ul className="divide-y divide-gray-200">
          {collections.map((collection) => (
            <li key={collection.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{collection.name}</h3>
                  {collection.description && (
                    <p className="text-sm text-gray-500">{collection.description}</p>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setEditingId(collection.id)
                      setFormData({
                        name: collection.name,
                        description: collection.description || ''
                      })
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(collection.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="fixed bottom-4 right-4">
        <Link 
          href="/"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
        >
          <HomeIcon className="w-5 h-5" />
          View Store
        </Link>
      </div>
    </div>
  )
} 