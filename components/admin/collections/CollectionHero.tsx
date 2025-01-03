import { useState, useRef } from 'react'
import Image from 'next/image'
import { Collection } from '@/types'
import { PencilIcon } from '@heroicons/react/24/outline'

interface Props {
  collection: Collection
  onUpdate: (data: Partial<Collection>) => Promise<void>
}

export default function CollectionHero({ collection, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(collection.name)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onUpdate({ name })
    setIsEditing(false)
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await onUpdate({ image: file })
    }
  }

  return (
    <div className="relative">
      <div className="h-48 w-full overflow-hidden">
        {collection.image ? (
          <Image
            src={collection.image}
            alt={collection.name}
            fill
            className="object-cover cursor-pointer"
            onClick={handleImageClick}
          />
        ) : (
          <div 
            className="h-full w-full bg-gray-200 flex items-center justify-center cursor-pointer"
            onClick={handleImageClick}
          >
            <span className="text-gray-400">Click to add cover image</span>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
          <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="flex items-center space-x-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-3xl"
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setName(collection.name)
                      setIsEditing(false)
                    }}
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <h2 className="text-2xl font-bold text-gray-900 truncate flex items-center">
                {collection.name}
                <button
                  onClick={() => setIsEditing(true)}
                  className="ml-3 text-gray-500 hover:text-gray-700"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              </h2>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 