import { Product, ProductVariant } from './product'

export interface CartItem {
  id: string
  product: Product
  variant: ProductVariant
  quantity: number
}

export interface CartStore {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (product: Product, variant: ProductVariant, quantity: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  total: number
} 