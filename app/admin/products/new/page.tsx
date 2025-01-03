'use client'

import ProductForm from '@/components/admin/ProductForm'

export default function NewProduct() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create a new product by filling out the form below.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <ProductForm />
      </div>
    </div>
  )
} 