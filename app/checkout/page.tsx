"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MainLayout from "@/components/main-layout"

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "Nigeria",
    streetAddress: "",
    apartmentNumber: "",
    townCity: "",
    state: "",
    phone: "",
    email: "",
    orderNote: "",
  })

  const orderItems = [
    {
      id: 1,
      name: "Listen Belive",
      price: 500,
      quantity: 1,
    },
  ]

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = 500
  const total = subtotal + shippingCost

  const formatCurrency = (amount: number) => {
    return `₦ ${amount.toLocaleString()}`
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePlaceOrder = () => {
    // Handle order placement logic here
    console.log("Order placed:", { formData, orderItems, total })
    alert("Order placed successfully!")
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <section className="bg-white border-b border-gray-200 pt-24 pb-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span>Home</span>
              <span>/</span>
              <span>Shop</span>
              <span>/</span>
              <span className="text-primary font-medium">Checkout</span>
            </div>
            <h2 className="text-xl font-semibold text-primary">Checkout</h2>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Billing Details */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">BILLING DETAILS</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nigeria">Nigeria</SelectItem>
                      <SelectItem value="Ghana">Ghana</SelectItem>
                      <SelectItem value="Kenya">Kenya</SelectItem>
                      <SelectItem value="South Africa">South Africa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <Input
                    placeholder="House Number and Street name"
                    value={formData.streetAddress}
                    onChange={(e) => handleInputChange("streetAddress", e.target.value)}
                    className="w-full mb-3"
                  />
                  <Input
                    placeholder="Apartment Number"
                    value={formData.apartmentNumber}
                    onChange={(e) => handleInputChange("apartmentNumber", e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Town/City</label>
                  <Input
                    value={formData.townCity}
                    onChange={(e) => handleInputChange("townCity", e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lagos">Lagos</SelectItem>
                      <SelectItem value="Abuja">Abuja</SelectItem>
                      <SelectItem value="Rivers">Rivers</SelectItem>
                      <SelectItem value="Kano">Kano</SelectItem>
                      <SelectItem value="Ogun">Ogun</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Ship to Different Address & Order Summary */}
            <div className="space-y-8">
              {/* Ship to Different Address */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">SHIP TO A DIFFERENT ADDRESS</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Note (Optional)</label>
                  <Textarea
                    placeholder="Note about your order, e.g. Special note for a delivery"
                    value={formData.orderNote}
                    onChange={(e) => handleInputChange("orderNote", e.target.value)}
                    className="w-full min-h-[120px]"
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Your Order</h3>

                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="font-bold text-gray-900">PRODUCT</span>
                    <span className="font-bold text-gray-900">PRODUCT</span>
                  </div>

                  {/* Order Items */}
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="text-gray-900">{formatCurrency(item.price)}</span>
                    </div>
                  ))}

                  {/* Subtotal */}
                  <div className="flex justify-between items-center py-2 border-t border-gray-200">
                    <span className="font-bold text-gray-900">SUBTOTAL</span>
                    <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between items-center py-2">
                    <span className="font-bold text-gray-900">SHIPPING</span>
                    <span className="text-gray-700">Flat Rate: {formatCurrency(shippingCost)}</span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center py-4 border-t border-gray-200">
                    <span className="font-bold text-xl text-gray-900">Total</span>
                    <span className="font-bold text-xl text-gray-900">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Button onClick={handlePlaceOrder} className="w-full bg-black hover:bg-gray-800 text-white h-12 mt-6">
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 mt-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative w-10 h-10">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KWLC%20Logo%201-aSNedKIy42avfHJjhU8zekfvcwmgKh.png"
                      alt="Kingdom Ways Living Church Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">KINGDOM WAYS</h3>
                    <p className="text-xs text-gray-400">LIVING CHURCH</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm">+ 234 70 433 2832</span>
                  </div>
                  <div className="text-sm">
                    24 Prince Ibrahim Eletu Avenue, Shoprite Circle Mall Road Jakande Bus Stop, Osapa London,Lagos
                  </div>
                  <div className="text-sm">info@kwlchq.org</div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-6">CONTACT US</h3>
                <div className="space-y-4">
                  <Input placeholder="Name" className="bg-gray-800 border-gray-700 text-white" />
                  <Input placeholder="Email" className="bg-gray-800 border-gray-700 text-white" />
                  <textarea
                    placeholder="Message"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder:text-gray-400 min-h-[100px]"
                  />
                  <Button className="w-full bg-black hover:bg-gray-800 text-white">Send</Button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-6">UP COMING EVENT</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((event) => (
                    <div key={event}>
                      <h4 className="font-medium">Wedding</h4>
                      <p className="text-sm text-gray-400">July 7 @ 8:00 am - 10:30 am</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-6">FOLLOW US</h3>
                <div className="flex gap-3">
                  {["linkedin", "twitter", "facebook", "instagram"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-xs">{social[0].toUpperCase()}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </MainLayout>
  )
}
