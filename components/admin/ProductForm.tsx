'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db, storage } from '@/lib/firebase'
import { doc, setDoc, collection, getDocs, addDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Notification from '@/components/ui/Notification'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import ImageCropper from '@/components/ui/ImageCropper'
import SortableImageGrid from './SortableImageGrid'
import { PlusIcon } from '@heroicons/react/24/outline'
import QuickCollectionModal from './QuickCollectionModal'

interface ProductImage {
  id?: string
  url: string
  file?: File
  order: number
}

interface Collection {
  id: string
  name: string
  description?: string
}

interface ProductFormProps {
  initialData?: {
    id?: string
    name: string
    price: number
    description: string
    images: ProductImage[]
    stock: number
    collectionId?: string
  }
}

interface FormErrors {
  [key: string]: string
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [notification, setNotification] = useState({
    show: false,
    type: 'success' as 'success' | 'error',
    message: ''
  })
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    price: initialData?.price?.toString() || '',
    description: initialData?.description || '',
    stock: initialData?.stock || 0,
    image: null as File | null,
    collectionId: initialData?.collectionId || '',
  })

  const [images, setImages] = useState<ProductImage[]>(
    initialData?.images || []
  )
  const [cropImage, setCropImage] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null)
  const [collections, setCollections] = useState<Collection[]>([])
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false)

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: (acceptedFiles) => {
      const newImages = acceptedFiles.map((file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        return {
          file,
          url: URL.createObjectURL(file),
          order: images.length
        }
      })
      setImages([...images, ...newImages])
    }
  })

  const handleImageCrop = (croppedImage: string) => {
    if (currentImageIndex === null) return

    // Convert base64 to blob
    fetch(croppedImage)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' })
        const updatedImages = [...images]
        updatedImages[currentImageIndex] = {
          ...updatedImages[currentImageIndex],
          url: croppedImage,
          file
        }
        setImages(updatedImages)
      })

    setCropImage(null)
    setCurrentImageIndex(null)
  }

  const handleDeleteImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleReorderImages = (dragIndex: number, hoverIndex: number) => {
    const reorderedImages = [...images]
    const draggedImage = reorderedImages[dragIndex]
    reorderedImages.splice(dragIndex, 1)
    reorderedImages.splice(hoverIndex, 0, draggedImage)
    reorderedImages.forEach((img, index) => {
      img.order = index
    })
    setImages(reorderedImages)
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative'
    }

    if (images.length === 0) {
      newErrors.images = 'At least one product image is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted', formData)

    if (!validateForm()) {
      console.log('Form validation failed', errors)
      return
    }

    setLoading(true)
    try {
      console.log('Uploading images...')
      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          if (image.file) {
            try {
              // Generate a unique filename
              const timestamp = Date.now()
              const randomString = Math.random().toString(36).substring(2, 8)
              const filename = `${timestamp}-${randomString}-${image.file.name}`
              
              const imageRef = ref(storage, `products/${filename}`)
              
              // Add metadata to the upload
              const metadata = {
                contentType: image.file.type,
                customMetadata: {
                  originalName: image.file.name
                }
              }

              await uploadBytes(imageRef, image.file, metadata)
              const url = await getDownloadURL(imageRef)
              return { url, order: image.order }
            } catch (error) {
              console.error('Error uploading image:', error)
              throw new Error('Failed to upload image')
            }
          }
          return image
        })
      )

      const productData = {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        stock: Number(formData.stock),
        images: uploadedImages,
        collectionId: formData.collectionId || null,
        updatedAt: new Date().toISOString()
      }

      console.log('Saving product data:', productData)

      if (initialData?.id) {
        await setDoc(doc(db, 'products', initialData.id), productData, { merge: true })
      } else {
        const docRef = await addDoc(collection(db, 'products'), productData)
        console.log('New product created with ID:', docRef.id)
      }

      setNotification({
        show: true,
        type: 'success',
        message: `Product ${initialData ? 'updated' : 'created'} successfully!`
      })

      router.push('/admin/products')
    } catch (error) {
      console.error('Error saving product:', error)
      setNotification({
        show: true,
        type: 'error',
        message: error instanceof Error ? error.message : 'Error saving product. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCollection = async (name: string, description: string) => {
    try {
      const docRef = await addDoc(collection(db, 'collections'), {
        name,
        description,
        createdAt: new Date().toISOString()
      })
      
      setCollections([...collections, {
        id: docRef.id,
        name,
        description
      }])
      
      setFormData(prev => ({ ...prev, collectionId: docRef.id }))
      
    } catch (error) {
      console.error('Error creating collection:', error)
    }
  }

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collectionsSnapshot = await getDocs(collection(db, 'collections'))
        const collectionsData = collectionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Collection[]
        setCollections(collectionsData)
      } catch (error) {
        console.error('Error fetching collections:', error)
      }
    }

    fetchCollections()
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {notification.show && (
        <Notification
          show={notification.show}
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Collection (Optional)
        </label>
        <div className="mt-1 flex gap-2">
          <select
            value={formData.collectionId}
            onChange={(e) => setFormData({ ...formData, collectionId: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">No Collection</option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setIsCollectionModalOpen(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            New
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Select a collection for this product or create a new one.
        </p>
      </div>

      {/* Price Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          required
          min="0"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
            errors.price ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          required
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Stock Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          required
          min="0"
          value={formData.stock}
          onChange={(e) =>
            setFormData({ ...formData, stock: parseInt(e.target.value) })
          }
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
            errors.stock ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.stock && (
          <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
        )}
      </div>

      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product Images
        </label>
        <div className="mt-2 space-y-4">
          {/* Drag & Drop Area */}
          <div
            {...getRootProps()}
            className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors"
          >
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <input {...getInputProps()} className="sr-only" />
                <p className="pl-1">Drag and drop images here</p>
              </div>
            </div>
          </div>

          {/* Manual Upload Button */}
          <div className="text-center">
            <span className="text-sm text-gray-500">or</span>
            <label
              htmlFor="manual-file-upload"
              className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span className="mt-2 block px-4 py-2 text-sm text-center border-2 border-gray-300 rounded-md hover:border-indigo-500 transition-colors">
                Select photos from your device
              </span>
              <input
                id="manual-file-upload"
                type="file"
                className="sr-only"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  const newImages = files.map((file) => ({
                    file,
                    url: URL.createObjectURL(file),
                    order: images.length
                  }))
                  setImages([...images, ...newImages])
                  // Reset the input value so the same file can be selected again
                  e.target.value = ''
                }}
              />
            </label>
          </div>

          {/* Image Preview Grid */}
          {images.length > 0 && (
            <SortableImageGrid
              images={images}
              onImagesReorder={setImages}
              onImageCrop={(index) => {
                setCropImage(images[index].url)
                setCurrentImageIndex(index)
              }}
              onImageDelete={handleDeleteImage}
            />
          )}
        </div>
      </div>

      {cropImage && (
        <ImageCropper
          image={cropImage}
          onCropComplete={(croppedImage) => handleImageCrop(croppedImage)}
          onCancel={() => {
            setCropImage(null)
            setCurrentImageIndex(null)
          }}
          aspectRatio={1}
        />
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center">
              <LoadingSpinner size="sm" />
              <span className="ml-2">Saving...</span>
            </span>
          ) : (
            'Save Product'
          )}
        </button>
      </div>

      <QuickCollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        onSubmit={handleCreateCollection}
      />
    </form>
  )
} 