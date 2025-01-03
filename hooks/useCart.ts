import { useCartStore } from '@/store/cartStore'
import type { CartItem } from '@/store/cartStore'

export function useCart() {
  const {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
  } = useCartStore()

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
  }
} 