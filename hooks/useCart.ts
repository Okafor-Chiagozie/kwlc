import { useState, useEffect } from 'react'
import { BookViewModel } from '@/types/book'

export interface CartItem extends BookViewModel {
  quantity: number
}

const CART_STORAGE_KEY = 'kwlc-cart'

export const useCart = () => {
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
        // Update quantity if item already exists
        return prev.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Add new item to cart
        return [...prev, { ...book, quantity }]
      }
    })
  }

  const removeFromCart = (bookId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== bookId))
  }

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId)
      return
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === bookId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const isInCart = (bookId: string) => {
    return cartItems.some(item => item.id === bookId)
  }

  const getCartItem = (bookId: string) => {
    return cartItems.find(item => item.id === bookId)
  }

  return {
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
    getSubtotal,
    isInCart,
    getCartItem
  }
} 