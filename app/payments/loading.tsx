"use client"

import { Loader2 } from "lucide-react"
import MainLayout from "@/components/main-layout"

export default function PaymentsLoading() {
  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-gray-600 text-lg">Loading payment information...</p>
        </div>
      </div>
    </MainLayout>
  )
}
