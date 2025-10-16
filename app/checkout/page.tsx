"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Minus, Plus, Trash } from "lucide-react"
import MainLayout from "@/components/main-layout"
import { useCart } from "@/hooks/useCart"
import { useChurchInfo } from "@/components/church-info-provider"
import { initiateOrder } from "@/services/bookPurchase"
import type { AddBookOrderRequest } from "@/types/book"

export default function CheckoutPage() {
  const { details, socials } = useChurchInfo()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogMessage, setDialogMessage] = useState("")

  const { cartItems, updateQuantity, removeFromCart, getSubtotal, getItemCount } = useCart()

  const subtotal = getSubtotal()
  const shippingCost = 0
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
      setDialogTitle("Cart is empty")
      setDialogMessage("Please add at least one item to your cart to proceed.")
      setDialogOpen(true)
      return
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setDialogTitle("Missing information")
      setDialogMessage("Please provide your first name, last name, and email to continue.")
      setDialogOpen(true)
      return
    }

    setIsPlacingOrder(true)
    
    try {
      // Build InitiateOrder payload per Swagger (AddBookOrderViewModel)
      const payload: AddBookOrderRequest = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        customerEmail: formData.email,
        // Map cart item ids to numbers if possible
        bookIds: cartItems
          .map((i) => Number(i.id))
          .filter((n) => Number.isFinite(n)) as number[],
        currency: "NGN",
        paymentMethodId: "card",
      }

      const resp = await initiateOrder(payload)

      if (resp?.isSuccessful) {
        const checkoutUrl = (resp as any)?.data?.data?.checkoutUrl
          || (resp as any)?.data?.checkoutUrl
          || (resp as any)?.checkoutUrl
          || (resp as any)?.data?.redirectUrl
          || (resp as any)?.data?.data?.redirectUrl

        if (total === 0) {
          setDialogTitle("Order received – no payment needed")
          setDialogMessage("Thank you! Your order total is ₦0. Please check your email for access and next steps.")
          setDialogOpen(true)
        } else if (checkoutUrl && typeof window !== 'undefined') {
          window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
        } else {
          setDialogTitle("Order initiated")
          setDialogMessage(resp.responseMessage || "Your order has been initiated successfully. Proceed to payment to complete your purchase.")
          setDialogOpen(true)
        }
      } else {
        const msg = resp?.responseMessage || "Failed to initiate order."
        setDialogTitle("Order failed")
        setDialogMessage(msg)
        setDialogOpen(true)
      }
    } catch (error) {
      console.error("Order placement error:", error)
      setDialogTitle("An error occurred")
      setDialogMessage("There was an error placing your order. Please try again.")
      setDialogOpen(true)
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section (match single pastor style) */}
        <section className="relative bg-gradient-to-r from-gray-900 to-primary/90 pt-28 pb-16 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden opacity-20 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/previous-sunday-1-mvsBAuZ8fv6sQ9BIEJLOZ7sL3xWqBZ.png')] bg-cover bg-center"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-primary/40"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex justify-start mb-3">
              <Link href="/shop" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                <span>Back to Shop</span>
              </Link>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Checkout</h1>
            <p className="text-white/80">Complete your order securely</p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-16 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}></div>
        </section>
        {/* Breadcrumb */}
        <section className="bg-white border-b border-gray-200 pt-6 pb-6">
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
            {/* Minimal Customer Details */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>Billing</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">BILLING DETAILS</h2>

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm space-y-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-2">We’ll send your receipt and download link to this email.</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-8">
              <div className="lg:sticky lg:top-24">
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Your Order</h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="font-bold text-gray-900">PRODUCT</span>
                      <span className="font-bold text-gray-900">TOTAL</span>
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
                            <h4 className="font-medium text-gray-900 mb-1 line-clamp-1">{item.title}</h4>
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
                              <Trash className="h-4 w-4" />
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
                  
                  {/* Free shipping message removed since shipping is always free */}

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

      {/* Modal styled like Admin Delete Branch */}
      {dialogOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4 !mt-0"
          onClick={() => setDialogOpen(false)}
        >
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>{dialogTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{dialogMessage}</p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </MainLayout>
  )
}
