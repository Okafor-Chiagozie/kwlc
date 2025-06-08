"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, User, Mail, Phone, Lock, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

export default function AdminRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim() || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.success("Registration successful! Please login with your credentials.")
      router.push("/admin/login")
    } catch (error) {
      toast.error("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Registration Form (Scrollable) */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="w-full max-w-md mx-auto p-8 space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KWLC%20Logo%201-aSNedKIy42avfHJjhU8zekfvcwmgKh.png"
                alt="KWLC Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join the KWLC Admin Portal</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`pl-12 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`pl-12 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`pl-12 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`pl-12 pr-12 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
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

            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`pl-12 pr-12 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/admin/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </p>
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to website
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section (Fixed) */}
      <div className="hidden lg:block flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
        {/* Background Pattern */}
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

        {/* Content - Fixed in the center */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12 text-center">
          <div className="max-w-md">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KWLC%20Logo%201-aSNedKIy42avfHJjhU8zekfvcwmgKh.png"
                alt="KWLC Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-4">Administrative Excellence</h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Empowering church leadership through streamlined management and insightful analytics.
            </p>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
