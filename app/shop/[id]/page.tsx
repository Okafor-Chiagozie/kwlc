"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ShopNav from "@/components/shop-nav"
import Link from "next/link"

const product = {
  id: 1,
  title: "Listen Belive",
  price: 150,
  description:
    "Dolor sit amet, consectetur adipiscing elit, sed do eiusmo tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in",
  longDescription:
    "Dolor sit amet, consectetur adipiscing elit, sed do eiusmo tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in",
  images: [
    "/placeholder.svg?height=400&width=300&text=Listen+Believe+Main",
    "/placeholder.svg?height=400&width=300&text=Listen+Believe+2",
    "/placeholder.svg?height=400&width=300&text=Listen+Believe+3",
  ],
  stockCount: 500,
}

const relatedProducts = [
  {
    id: 2,
    title: "LISTEN BELIVE",
    price: 150,
    image: "/placeholder.svg?height=300&width=200&text=Listen+Believe+Related+1",
  },
  {
    id: 3,
    title: "LISTEN BELIVE",
    price: 150,
    image: "/placeholder.svg?height=300&width=200&text=Just+Prayer+Book",
  },
  {
    id: 4,
    title: "LISTEN BELIVE",
    price: 150,
    image: "/placeholder.svg?height=300&width=200&text=Lorem+Book",
  },
  {
    id: 5,
    title: "LISTEN BELIVE",
    price: 150,
    image: "/placeholder.svg?height=300&width=200&text=Always+Say+Prayer",
  },
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")

  const formatCurrency = (amount: number) => {
    return `₦${amount}`
  }

  return (
    <>
      <ShopNav />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Shop Now Breadcrumb */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary">Shop Now</h2>
          </div>

          {/* Product Detail Section */}
          <div className="bg-white rounded-lg p-8 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left - Thumbnail Images */}
              <div className="lg:col-span-1 order-1 lg:order-1">
                <div className="space-y-4">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative w-20 h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                        selectedImage === index ? "border-primary" : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.title} view ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Center - Main Product Image */}
              <div className="lg:col-span-1 order-2 lg:order-2">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={product.images[selectedImage] || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Right - Product Info */}
              <div className="lg:col-span-1 order-3 lg:order-3">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

                <div className="mb-6">
                  <span className="text-lg text-gray-600">Price: </span>
                  <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

                <div className="mb-6">
                  <span className="text-sm text-gray-600 italic">{product.stockCount} Copies Available</span>
                </div>

                {/* Quantity and Purchase */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium">Quantity</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                        className="w-16 text-center border-0 focus:ring-0"
                        min="1"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <Link href="/checkout" className="w-full">
                    <Button className="w-full bg-black hover:bg-gray-800 text-white h-12 text-lg">Purchase</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white rounded-lg p-8 mb-12">
            <div className="border-b border-gray-200 mb-6">
              <div className="flex space-x-8">
                <button
                  className={`pb-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === "description"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
                <button
                  className={`pb-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === "additional"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("additional")}
                >
                  Additional Information
                </button>
              </div>
            </div>

            <div className="text-gray-700 leading-relaxed">
              {activeTab === "description" && <p>{product.longDescription}</p>}
              {activeTab === "additional" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium">Author</span>
                      <span>Pastor Ken Mbachi</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium">Pages</span>
                      <span>240</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium">Language</span>
                      <span>English</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium">Publisher</span>
                      <span>Kingdom Ways Publishing</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Product</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all duration-300"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {relatedProduct.title}
                    </h3>
                    <div className="text-sm text-gray-600 mb-1">
                      Price: <span className="font-bold text-primary">{formatCurrency(relatedProduct.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
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
    </>
  )
}
