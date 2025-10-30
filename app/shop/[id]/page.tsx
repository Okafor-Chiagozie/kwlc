"use client"

import { useState } from "react"
import Image from "next/image"
import { } from "lucide-react"
import { Button } from "@/components/ui/button"
import ShopNav from "@/components/shop-nav"
import MainLayout from "@/components/main-layout"
import Link from "next/link"
import { useChurchInfo } from "@/components/church-info-provider"
import { useApi } from "@/hooks/useApi"
import { getBook, getBooks } from "@/services/book"
import type { BookViewModel } from "@/types/book"
import { useCart } from "@/hooks/useCart"
import { useParams } from "next/navigation"

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

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState("description")
  const { details, socials } = useChurchInfo()
  const { addToCart, isInCart } = useCart()
  const params = useParams() as { id?: string }
  const idNum = Number(params?.id || 0)

  // Fetch book details
  const { data: bookResp } = useApi(() => getBook(idNum), [idNum])
  const book: BookViewModel | undefined = Array.isArray(bookResp?.data) ? (bookResp as any)?.data?.[0] : undefined
  const { data: latestBooksResp } = useApi(() => getBooks({ pageSize: 4, pageNumber: 1, searchParams: {} }), [])
  const latestBooks: BookViewModel[] = Array.isArray((latestBooksResp as any)?.data) ? (latestBooksResp as any).data : []

  const formatCurrency = (amount: number) => {
    return `₦${amount}`
  }

  return (
    <MainLayout>
      <ShopNav />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-primary/90 pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-20 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/previous-sunday-1-mvsBAuZ8fv6sQ9BIEJLOZ7sL3xWqBZ.png')] bg-cover bg-center"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-primary/40"></div>
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="flex justify-start mb-3">
            <Link href="/shop" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              <span>Back to Shop</span>
            </Link>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-2">{book?.title || product.title}</h1>
          {book?.author && (
            <p className="text-white/90">by {book.author}</p>
          )}
          <p className="text-white/80 max-w-2xl mt-2">A thoughtful read to inspire growth and strengthen your faith.</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}></div>
      </section>

      <div className="min-h-screen bg-gray-50">
        <div className="w-full pt-0 pb-8">

          {/* Product Detail Section */}
          <div className="bg-white p-8 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Product Image */}
              <div className="lg:col-span-1">
                <div className="relative aspect-[3/4] overflow-hidden shadow-2xl">
                  <Image
                    src={book?.imageUrl || product.images[0] || "/placeholder.svg"}
                    alt={book?.title || product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Right - Product Info */}
              <div className="lg:col-span-2">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">{book?.title || product.title}</h1>
                {book?.author && (
                  <p className="text-gray-600 mb-4 text-lg">by {book.author}</p>
                )}

                <div className="mb-6">
                  <span className="text-2xl font-bold text-primary">{book?.priceDisplay || formatCurrency(book?.price ?? product.price)}</span>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed text-xl">{book?.description || product.description}</p>

                <div className="mb-6">
                  <span className="text-sm text-gray-600 italic">{product.stockCount} Copies Available</span>
                </div>

                {/* Purchase */}
                <div className="space-y-4">
                  {book && (book.price === 0 || (book.priceDisplay && book.priceDisplay.toLowerCase() === 'free')) ? (
                    <a href={book.bookUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg">Download</Button>
                    </a>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg"
                        onClick={() => { if (book && !isInCart(book.id)) addToCart(book) }}
                        disabled={!!(book && isInCart(book.id))}
                      >
                        {book && isInCart(book.id) ? 'In Cart' : 'Add to Cart'}
                      </Button>
                      <Link href="/checkout" className="w-full">
                        <Button className="w-full bg-black hover:bg-gray-800 text-white h-12 text-lg">Buy Now</Button>
                      </Link>
                    </div>
                  )}
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
              {activeTab === "description" && <p>{book?.description || product.longDescription}</p>}
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

          {/* Latest Books */}
          <section className="px-4 md:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Books</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {latestBooks.map((b) => (
                <Link key={b.id} href={`/shop/${b.id}`} className="block">
                  <div
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all duration-300 h-full flex flex-col"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={b.imageUrl || "/placeholder.svg"}
                        alt={b.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-2">
                        {b.title}
                      </h3>
                      {b.author && (
                        <p className="text-sm text-gray-500 mb-2">by {b.author}</p>
                      )}
                      <div className="flex items-center justify-between text-sm mt-auto">
                        <span className="font-bold text-primary">{b.priceDisplay || formatCurrency(b.price)}</span>
                        {b.category && (
                          <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                            {b.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  )
}
