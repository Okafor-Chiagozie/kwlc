"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUserById } from "@/services/user"
import { UserViewModel } from "@/types/user"

interface UseAuthReturn {
  isAuthenticated: boolean
  isLoading: boolean
  user: UserViewModel | null
  login: (userId: string) => void
  logout: () => void
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<UserViewModel | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setIsLoading(true)
      const auth = localStorage.getItem("adminAuth")
      const userIdFromStorage = localStorage.getItem("userId")

      if (!auth) {
        setIsAuthenticated(false)
        setUser(null)
        return
      }

      setIsAuthenticated(true)

      // Fetch user details if userId exists
      if (userIdFromStorage && !isNaN(Number(userIdFromStorage))) {
        try {
          const response = await getUserById(Number(userIdFromStorage))
          if (response.isSuccessful && response.data) {
            setUser(response.data)
          }
        } catch (error) {
          console.error("Failed to fetch user details:", error)
          // Keep authenticated state even if user fetch fails
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = (userId: string) => {
    localStorage.setItem("adminAuth", "true")
    localStorage.setItem("userId", userId)
    setIsAuthenticated(true)
    checkAuth() // Refetch user details
  }

  const logout = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("userId")
    setIsAuthenticated(false)
    setUser(null)
    router.push("/admin/login")
  }

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout
  }
}

// Hook for protecting admin routes
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, isLoading, router])

  return { isAuthenticated, isLoading }
} 