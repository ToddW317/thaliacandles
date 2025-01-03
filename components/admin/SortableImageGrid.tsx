'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useImageStore } from '@/stores/imageStore'

interface ProductImage {
  id?: string
  url: string
  file?: File
  order: number
}

interface SortableItemProps {
  image: ProductImage
  index: number
  onCrop: () => void
  onDelete: () => void
}

function SortableItem({ image, index, onCrop, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.url })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group cursor-move bg-white rounded-lg shadow-sm 
        ${isDragging ? 'ring-2 ring-indigo-500 shadow-lg' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <Image
          src={image.url}
          alt={`Product ${index + 1}`}
          fill
          className="object-cover"
        />
        {/* Primary Image Badge */}
        {index === 0 && (
          <div className="absolute top-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded-md text-xs font-medium">
            Primary Image
          </div>
        )}
        
        {/* Drag Handle Indicator */}
        <div className="absolute top-2 right-2 p-1 bg-white/80 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-black bg-opacity-50 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation() // Prevent drag when clicking buttons
            onCrop()
          }}
          className="p-2 text-white hover:text-gray-200 mr-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation() // Prevent drag when clicking buttons
            onDelete()
          }}
          className="p-2 text-white hover:text-gray-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}

interface SortableImageGridProps {
  images: ProductImage[]
  onImagesReorder: (newImages: ProductImage[]) => void
  onImageCrop: (index: number) => void
  onImageDelete: (index: number) => void
}

export default function SortableImageGrid({
  images,
  onImagesReorder,
  onImageCrop,
  onImageDelete,
}: SortableImageGridProps) {
  const [previewMode, setPreviewMode] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)
  const { canUndo, canRedo, undo, redo, addToHistory } = useImageStore()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.url === active.id)
      const newIndex = images.findIndex((img) => img.url === over.id)

      const newImages = arrayMove(images, oldIndex, newIndex).map((img, index) => ({
        ...img,
        order: index,
      }))

      addToHistory(newImages)
      onImagesReorder(newImages)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      if (e.shiftKey) {
        if (canRedo) redo()
      } else {
        if (canUndo) undo()
      }
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canUndo, canRedo])

  if (previewMode) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <div className="relative h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={previewIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="h-full flex items-center justify-center"
            >
              <div className="relative w-full h-full">
                <Image
                  src={images[previewIndex].url}
                  alt={`Preview ${previewIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
            <button
              onClick={() => setPreviewIndex((prev) => Math.max(0, prev - 1))}
              disabled={previewIndex === 0}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 disabled:opacity-50"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setPreviewIndex((prev) => Math.min(images.length - 1, prev + 1))}
              disabled={previewIndex === images.length - 1}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 disabled:opacity-50"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setPreviewMode(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            Drag images to reorder. The first image will be displayed as the primary image.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setPreviewMode(true)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Preview
            </button>
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              title="Undo (Ctrl/⌘ + Z)"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              title="Redo (Ctrl/⌘ + Shift + Z)"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <SortableContext items={images.map(img => img.url)} strategy={rectSortingStrategy}>
          <motion.div
            layout
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={image.url}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <SortableItem
                    image={image}
                    index={index}
                    onCrop={() => onImageCrop(index)}
                    onDelete={() => onImageDelete(index)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </SortableContext>
      </div>
    </DndContext>
  )
} 