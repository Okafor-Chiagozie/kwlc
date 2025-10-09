'use client'
import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { BookViewModel } from '@/types/book'

export interface CartItem extends BookViewModel {
  quantity: number
}

const CART_STORAGE_KEY = 'kwlc-cart'

type CartContextValue = {
  cartItems: CartItem[]
  isLoading: boolean
  addToCart: (book: BookViewModel, quantity?: number) => void
  removeFromCart: (bookId: string | number) => void
  updateQuantity: (bookId: string | number, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
  isInCart: (bookId: string | number) => boolean
  getCartItem: (bookId: string | number) => CartItem | undefined
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [cartItems, isLoading])

  const addToCart = (book: BookViewModel, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === book.id)
      if (existingItem) {
        return prev.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...prev, { ...book, quantity }]
      }
    })
  }

  const removeFromCart = (bookId: string | number) => {
    setCartItems(prev => prev.filter(item => item.id !== bookId))
  }

  const updateQuantity = (bookId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId)
      return
    }
    setCartItems(prev => prev.map(item => (item.id === bookId ? { ...item, quantity } : item)))
  }

  const clearCart = () => setCartItems([])

  const getItemCount = () => cartItems.reduce((total, item) => total + item.quantity, 0)
  const getSubtotal = () => cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const isInCart = (bookId: string | number) => cartItems.some(item => item.id === bookId)
  const getCartItem = (bookId: string | number) => cartItems.find(item => item.id === bookId)

  const value: CartContextValue = {
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
    getSubtotal,
    isInCart,
    getCartItem,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}


