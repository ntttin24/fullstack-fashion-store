import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types'
import { cartApi } from '@/lib/api'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  justAdded: boolean
  isSyncing: boolean
  addItem: (item: Omit<CartItem, 'id'>, isAuthenticated?: boolean) => void
  removeItem: (id: string, isAuthenticated?: boolean) => void
  updateQuantity: (id: string, quantity: number, isAuthenticated?: boolean) => void
  clearCart: (isAuthenticated?: boolean) => void
  toggleCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  setJustAdded: (value: boolean) => void
  loadCartFromBackend: () => Promise<void>
  syncCartToBackend: () => Promise<void>
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      justAdded: false,
      isSyncing: false,
      
      addItem: async (newItem, isAuthenticated = false) => {
        const items = get().items
        const existingItem = items.find(
          item => 
            item.productId === newItem.productId && 
            item.size === newItem.size && 
            item.color === newItem.color
        )
        
        // Update local state first for immediate feedback
        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
            justAdded: true
          })
        } else {
          const id = `${newItem.productId}-${newItem.size}-${newItem.color}-${Date.now()}`
          set({
            items: [...items, { ...newItem, id }],
            justAdded: true
          })
        }
        
        // Sync with backend if user is authenticated
        if (isAuthenticated) {
          try {
            await cartApi.addToCart({
              productId: newItem.productId,
              quantity: newItem.quantity,
              size: newItem.size,
              color: newItem.color,
            })
          } catch (error) {
            console.error('Failed to sync cart with backend:', error)
            // Revert local changes if backend sync fails
            set({ items: get().items.filter(item => 
              !(item.productId === newItem.productId && 
                item.size === newItem.size && 
                item.color === newItem.color)
            )})
            throw error // Re-throw to let the UI handle it
          }
        }
        
        // Reset justAdded after animation
        setTimeout(() => set({ justAdded: false }), 1000)
      },
      
      removeItem: async (id, isAuthenticated = false) => {
        const item = get().items.find(i => i.id === id)
        
        set({
          items: get().items.filter(item => item.id !== id)
        })
        
        // Sync with backend if user is authenticated
        if (isAuthenticated && item) {
          try {
            await cartApi.removeFromCart(id)
          } catch (error) {
            console.error('Failed to remove item from backend:', error)
          }
        }
      },
      
      updateQuantity: async (id, quantity, isAuthenticated = false) => {
        if (quantity <= 0) {
          get().removeItem(id, isAuthenticated)
          return
        }
        
        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        })
        
        // Sync with backend if user is authenticated
        if (isAuthenticated) {
          try {
            await cartApi.updateCartItem(id, { quantity })
          } catch (error) {
            console.error('Failed to update cart item on backend:', error)
          }
        }
      },
      
      clearCart: async (isAuthenticated = false) => {
        set({ items: [] })
        
        // Sync with backend if user is authenticated
        if (isAuthenticated) {
          try {
            await cartApi.clearCart()
          } catch (error) {
            console.error('Failed to clear cart on backend:', error)
          }
        }
      },
      
      toggleCart: () => {
        set({ isOpen: !get().isOpen })
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
      
      setJustAdded: (value) => {
        set({ justAdded: value })
      },
      
      loadCartFromBackend: async () => {
        set({ isSyncing: true })
        try {
          const backendCart = await cartApi.getCart() as Array<{
            id: string;
            productId: string;
            product: {
              name: string;
              price: number;
              images: string[];
            };
            size: string;
            color: string;
            quantity: number;
          }>
          
          // Transform backend cart items to frontend format
          const items: CartItem[] = backendCart.map((item) => ({
            id: item.id,
            productId: item.productId,
            name: item.product.name,
            price: item.product.price,
            image: item.product.images[0] || '',
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          }))
          
          set({ items, isSyncing: false })
        } catch (error) {
          console.error('Failed to load cart from backend:', error)
          set({ isSyncing: false })
        }
      },
      
      syncCartToBackend: async () => {
        set({ isSyncing: true })
        try {
          const items = get().items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          }))
          
          await cartApi.syncCart(items)
          set({ isSyncing: false })
        } catch (error) {
          console.error('Failed to sync cart to backend:', error)
          set({ isSyncing: false })
        }
      }
    }),
    {
      name: 'cart-storage'
    }
  )
)

