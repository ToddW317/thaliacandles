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

export interface Product {
  id: string
  name: string
  description: string
  images: ProductImage[]
  price: number
  variants: ProductVariant[]
  scent: string
  burnTime: string
  weight: string
  ingredients: string[]
  featured?: boolean
  collectionId: string
} 