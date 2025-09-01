"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Minus, Plus, X } from "lucide-react"
import MainLayout from "@/components/main-layout"
import { useCart } from "@/hooks/useCart"
import { useChurchInfo } from "@/components/church-info-provider"

export default function CheckoutPage() {
  const { details, socials } = useChurchInfo()
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

  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const { cartItems, updateQuantity, removeFromCart, getSubtotal, getItemCount } = useCart()

  const subtotal = getSubtotal()
  const shippingCost = subtotal > 0 ? (subtotal >= 5000 ? 0 : 1000) : 0 // Free shipping over ₦5,000
  const total = subtotal + shippingCost

  // Redirect to shop if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      // Could add a toast here saying "Cart is empty"
    }
  }, [cartItems])

  const formatCurrency = (amount: number) => {
    return `₦ ${amount.toLocaleString()}`
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty")
      return
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert("Please fill in all required fields")
      return
    }

    setIsPlacingOrder(true)
    
    try {
      // Here you would integrate with the book purchase API
      // For now, we'll just simulate the order
      console.log("Order placed:", { 
        customer: formData, 
        items: cartItems, 
        total,
        itemCount: getItemCount()
      })
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert("Order placed successfully! You will receive a confirmation email shortly.")
      
      // In a real app, you'd redirect to a success page or order confirmation
      // and clear the cart after successful payment processing
      
    } catch (error) {
      console.error("Order placement error:", error)
      alert("There was an error placing your order. Please try again.")
    } finally {
      setIsPlacingOrder(false)
    }
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

                  {/* Cart Items */}
                  {cartItems.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Your cart is empty</p>
                      <Link href="/shop">
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                          Continue Shopping
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 py-4 border-b border-gray-100">
                          <div className="relative w-16 h-20 flex-shrink-0 rounded-md overflow-hidden">
                            <Image
                              src={item.imageUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">by {item.author}</p>
                            <p className="text-sm font-semibold text-primary">
                              {item.priceDisplay || `₦${item.price.toLocaleString()}`}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="w-8 h-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                    </div>
                  ))}
                    </div>
                  )}

                  {/* Subtotal */}
                  <div className="flex justify-between items-center py-2 border-t border-gray-200">
                    <span className="font-bold text-gray-900">SUBTOTAL</span>
                    <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between items-center py-2">
                    <span className="font-bold text-gray-900">SHIPPING</span>
                    <span className="text-gray-700">
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Free shipping</span>
                      ) : (
                        `Flat Rate: ${formatCurrency(shippingCost)}`
                      )}
                    </span>
                  </div>
                  
                  {/* Free shipping message */}
                  {subtotal > 0 && subtotal < 5000 && (
                    <div className="text-sm text-primary bg-primary/5 p-2 rounded">
                      Add {formatCurrency(5000 - subtotal)} more for free shipping!
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex justify-between items-center py-4 border-t border-gray-200">
                    <span className="font-bold text-xl text-gray-900">Total</span>
                    <span className="font-bold text-xl text-gray-900">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePlaceOrder} 
                  disabled={cartItems.length === 0 || isPlacingOrder}
                  className="w-full bg-black hover:bg-gray-800 text-white h-12 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPlacingOrder ? "Processing..." : `Place Order (${getItemCount()} ${getItemCount() === 1 ? 'item' : 'items'})`}
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
                    <span className="text-sm">{details.phoneNumber || "+234 70 433 2832"}</span>
                  </div>
                  <div className="text-sm">
                    {details.address || "24 Prince Ibrahim Eletu Avenue, Shoprite Circle Mall Road Jakande Bus Stop, Osapa London,Lagos"}
                  </div>
                  <div className="text-sm">{details.email || "info@kwlchq.org"}</div>
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
                  {socials.linkedin && (
                    <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"><span className="text-xs">L</span></a>
                  )}
                  {socials.twitter && (
                    <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"><span className="text-xs">T</span></a>
                  )}
                  {socials.facebook && (
                    <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"><span className="text-xs">F</span></a>
                  )}
                  {socials.instagram && (
                    <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"><span className="text-xs">I</span></a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </MainLayout>
  )
}
