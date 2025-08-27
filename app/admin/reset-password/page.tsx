"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { resetPassword } from "@/services/user"
import { ResetPasswordRequest } from "@/types/user"

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (!tokenParam) {
      toast.error("Invalid or missing reset token")
      router.push("/admin/forgot-password")
      return
    }
    setToken(tokenParam)
  }, [searchParams, router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must contain uppercase, lowercase, and number"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)

    if (!token) {
      toast.error("Invalid reset token")
      return
    }

    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    setIsLoading(true)

    try {
      const requestData: ResetPasswordRequest = {
        token: token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      }

      const response = await resetPassword(requestData)

      if (response.isSuccessful) {
        setIsSuccess(true)
        toast.success("Password reset successfully!")
      } else {
        if (response.errors && response.errors.length > 0) {
          const errorMessages = response.errors.map(error => error.description).join(", ")
          setApiError(errorMessages)
          toast.error(errorMessages)
        } else {
          setApiError(response.responseMessage || "Failed to reset password")
          toast.error(response.responseMessage || "Failed to reset password")
        }
      }
    } catch (error: any) {
      console.error("Reset password error:", error)
      
      let errorMessage = "Failed to reset password. Please try again."
      
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

  if (isSuccess) {
    return (
      <div className="min-h-screen flex">
        {/* Left Side - Success Message */}
        <div className="flex-1 bg-white flex">
          <div className="w-full overflow-y-auto py-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-8 flex items-center justify-center">
            <div className="w-full max-w-md space-y-8 text-center">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Password Reset Successful!</h1>
                <p className="text-gray-600">
                  Your password has been successfully updated. You can now login with your new password.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => router.push("/admin/login")}
                  className="w-full h-12 bg-primary hover:bg-primary/90"
                >
                  Continue to Login
                </Button>

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
        </div>

        {/* Right Side - Branding */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 items-center justify-center p-8 relative overflow-hidden">
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
              <Lock className="w-16 h-16 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-2">Secure Access</h2>
              <p className="text-xl text-gray-300">Your account is protected</p>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-4">This password reset link is invalid or has expired.</p>
          <Link
            href="/admin/forgot-password"
            className="text-primary hover:text-primary/80 font-medium"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Reset Password Form */}
      <div className="flex-1 bg-white flex">
        <div className="w-full overflow-y-auto py-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-8 flex items-center justify-center">
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
              <h1 className="text-2xl font-bold text-gray-900">Reset Your Password</h1>
              <p className="text-gray-600">
                Enter your new password below. Make sure it's strong and secure.
              </p>
            </div>

            {/* API Error Display */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Reset Failed</h3>
                  <p className="text-sm text-red-700 mt-1">{apiError}</p>
                </div>
              </div>
            )}

            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange("newPassword", e.target.value)}
                        className={`pl-10 pr-10 h-12 border-gray-200 focus:border-primary ${
                          errors.newPassword ? "border-red-500" : ""
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
                    {errors.newPassword && <p className="text-sm text-red-600 mt-1">{errors.newPassword}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className={`pl-10 pr-10 h-12 border-gray-200 focus:border-primary ${
                          errors.confirmPassword ? "border-red-500" : ""
                        }`}
                        disabled={isLoading}
                        required
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

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Password Requirements:</p>
                        <ul className="mt-1 space-y-1 text-blue-700">
                          <li>• At least 8 characters long</li>
                          <li>• Contains uppercase and lowercase letters</li>
                          <li>• Contains at least one number</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? "Resetting Password..." : "Reset Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Footer Links */}
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link href="/admin/login" className="text-primary hover:text-primary/80 font-medium">
                  Back to Login
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
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 items-center justify-center p-8 relative overflow-hidden">
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
            <Lock className="w-16 h-16 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-2">New Password</h2>
            <p className="text-xl text-gray-300">Secure your account</p>
          </div>
          <div className="text-sm text-gray-400 max-w-md">
            <p>Choose a strong password to keep your account safe and secure.</p>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
} 