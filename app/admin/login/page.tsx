"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff, User, Lock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { login } from "@/services/user"
import { LoginRequest } from "@/types/user"

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const router = useRouter()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = "Email or username is required"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)

    if (!validateForm()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      const loginData: LoginRequest = {
        username: formData.username,
        password: formData.password
      }

      const response = await login(loginData)

      if (response.isSuccessful) {
        // Store auth info in localStorage (you might want to use a more secure method)
        localStorage.setItem("adminAuth", "true")
        localStorage.setItem("userId", response.data.toString())
        
        toast.success("Login successful! Redirecting to dashboard...")
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 1000)
      } else {
        if (response.errors && response.errors.length > 0) {
          const errorMessages = response.errors.map(error => error.description).join(", ")
          setApiError(errorMessages)
          toast.error(errorMessages)
        } else {
          setApiError(response.responseMessage || "Login failed")
          toast.error(response.responseMessage || "Login failed")
        }
      }
    } catch (error: any) {
      console.error("Login error:", error)
      
      let errorMessage = "Login failed. Please try again."
      
      if (error?.response?.data?.responseMessage) {
        errorMessage = error.response.data.responseMessage
      } else if (error?.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
        errorMessage = error.response.data.errors.map((e: any) => e.description || e.message).join(", ")
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      setApiError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
    if (apiError) {
      setApiError(null)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 bg-white flex">
        <div className="w-full overflow-y-auto py-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-8 flex items-center justify-center" style={{ maxHeight: '100vh' }}>
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KWLC%20Logo%201-aSNedKIy42avfHJjhU8zekfvcwmgKh.png"
                  alt="KWLC Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Church Admin Dashboard</h1>
            </div>

            {/* API Error Display */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Login Failed</h3>
                  <p className="text-sm text-red-700 mt-1">{apiError}</p>
                </div>
              </div>
            )}

            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="sr-only">
                      Email or Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Your login or Email"
                        value={formData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        className={`pl-10 h-12 border-gray-200 focus:border-primary ${
                          errors.username ? "border-red-500" : ""
                        }`}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="sr-only">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`pl-10 pr-10 h-12 border-gray-200 focus:border-primary ${
                          errors.password ? "border-red-500" : ""
                        }`}
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <button type="button" className="text-sm text-primary hover:text-primary/80">
                      Forgotten Password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-black hover:bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="text-center text-sm text-gray-500">© Kingdom Ways 2024</div>
          </div>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 items-center justify-center p-8 relative overflow-hidden" style={{ height: '100vh', overflow: 'hidden' }}>
        <div className="absolute inset-0">
          <Image
            src="/images/geometric-bg.png"
            alt="Geometric Background"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80"></div>
        <div className="relative z-10 text-center text-white space-y-8">
          <div className="w-32 h-32 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-2">KINGDOM WAYS</h2>
            <p className="text-xl text-gray-300">Living Church</p>
          </div>
          <div className="text-sm text-gray-400 max-w-md">
            <p>24 Prince Ibrahim Eletu Avenue, Shoprite Circle</p>
            <p>Mall Road Jakande Bus Stop, Osapa</p>
            <p>London, Lagos</p>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}