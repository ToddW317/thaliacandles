export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  scent?: string
  burnTime?: string
  weight?: string
  collectionId?: string
}

export interface ProductImage {
  id: string
  url: string
  alt: string
}

export interface ProductVariant {
  id: string
  size: string
  price: number
  inStock: boolean
}

export interface Collection {
  id: string
  name: string
  description: string
  image?: string
  productCount?: number
  featured?: boolean
} 