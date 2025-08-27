"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { forgotPassword } from "@/services/user"
import { ForgotPasswordRequest } from "@/types/user"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const validateEmail = () => {
    if (!email.trim()) {
      return "Email address is required"
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address"
    }
    
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const emailError = validateEmail()
    if (emailError) {
      setError(emailError)
      toast.error(emailError)
      return
    }

    setIsLoading(true)

    try {
      const requestData: ForgotPasswordRequest = {
        email: email.trim()
      }

      const response = await forgotPassword(requestData)

      if (response.isSuccessful) {
        setIsSuccess(true)
        toast.success("Password reset instructions sent to your email!")
      } else {
        if (response.errors && response.errors.length > 0) {
          const errorMessages = response.errors.map(error => error.description).join(", ")
          setError(errorMessages)
          toast.error(errorMessages)
        } else {
          setError(response.responseMessage || "Failed to send reset instructions")
          toast.error(response.responseMessage || "Failed to send reset instructions")
        }
      }
    } catch (error: any) {
      console.error("Forgot password error:", error)
      
      let errorMessage = "Failed to send reset instructions. Please try again."
      
      if (error?.response?.data?.responseMessage) {
        errorMessage = error.response.data.responseMessage
      } else if (error?.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
        errorMessage = error.response.data.errors.map((e: any) => e.description || e.message).join(", ")
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (value: string) => {
    setEmail(value)
    if (error) {
      setError(null)
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
                <h1 className="text-2xl font-bold text-gray-900">Check Your Email</h1>
                <p className="text-gray-600">
                  We've sent password reset instructions to{" "}
                  <span className="font-medium text-gray-900">{email}</span>
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Didn't receive the email?</p>
                    <ul className="mt-2 space-y-1 text-blue-700">
                      <li>• Check your spam or junk folder</li>
                      <li>• Make sure the email address is correct</li>
                      <li>• Wait a few minutes for the email to arrive</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setIsSuccess(false)
                    setEmail("")
                    setError(null)
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Try Different Email
                </Button>

                <Link
                  href="/admin/login"
                  className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Login
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
              <Mail className="w-16 h-16 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-2">Reset Your Password</h2>
              <p className="text-xl text-gray-300">Secure account recovery</p>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Forgot Password Form */}
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
              <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
              <p className="text-gray-600">
                No worries! Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className={`pl-10 h-12 border-gray-200 focus:border-primary ${
                          error ? "border-red-500" : ""
                        }`}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending Instructions..." : "Send Reset Instructions"}
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
            <Mail className="w-16 h-16 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-2">Password Recovery</h2>
            <p className="text-xl text-gray-300">Secure account access</p>
          </div>
          <div className="text-sm text-gray-400 max-w-md">
            <p>Your account security is our priority. We'll help you regain access safely.</p>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
} 