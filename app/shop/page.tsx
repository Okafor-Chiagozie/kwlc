"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ShoppingCart, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import MainLayout from "@/components/main-layout"

const products = [
  {
    id: 1,
    title: "LISTEN BELIVE",
    price: 150,
    image: "/placeholder.svg?height=300&width=200&text=Listen+Believe+Book+1",
    category: "Books",
    inStock: true,
    featured: false,
  },
  {
    id: 2,
    title: "LISTEN BELIVE",
    price: 150,
    image: "/placeholder.svg?height=300&width=200&text=We+Build+Hope+Book",
    category: "Books",
    inStock: true,
    featured: true,
  },
  {
    id: 3,
    title: "LISTEN BELIVE",
    price: 150,
    image: "/placeholder.svg?height=300&width=200&text=What+We+Believe+Book",
    category: "Books",
    inStock: true,
    featured: false,
  },
  {
    id: 4,
    title: "LISTEN BELIVE",
    price: 150,
    image: "/placeholder.svg?height=300&width=200&text=Listen+Believe+Book+4",
    category: "Books",
    inStock: true,
    featured: false,
  },
  {
    id: 5,
    title: "LISTEN BELIVE",
    price: 150,
    image: "/placeholder.svg?height=300&width=200&text=Just+Prayer+Book",
    category: "Books",
    inStock: true,
    featured: false,
  },
  {
    id: 6,
    title: "LISTEN BELIVE",
    price: 150,
    image: "/placeholder.svg?height=300&width=200&text=Always+Say+Prayer",
    category: "Books",
    inStock: true,
    featured: false,
  },
  {
    id: 7,
    title: "LISTEN BELIVE",
    price: 150,
    image: "/placeholder.svg?height=300&width=200&text=Listen+Believe+Book+7",
    category: "Books",
    inStock: true,
    featured: false,
  },
  {
    id: 8,
    title: "LISTEN BELIVE",
    price: 150,
    image: "/placeholder.svg?height=300&width=200&text=Always+Say+Prayer+2",
    category: "Books",
    inStock: true,
    featured: false,
  },
  {
    id: 9,
    title: "LISTEN BELIVE",
    price: 150,
    image: "/placeholder.svg?height=300&width=200&text=Lorem+Book",
    category: "Books",
    inStock: true,
    featured: false,
  },
]

const topProducts = [
  {
    id: 1,
    title: "We Build Hope",
    price: 150,
    image: "/placeholder.svg?height=100&width=80&text=We+Build+Hope",
    availability: "500 copies Available",
  },
  {
    id: 2,
    title: "We Build Hope",
    price: 150,
    image: "/placeholder.svg?height=100&width=80&text=We+Build+Hope+2",
    availability: "500 copies Available",
  },
  {
    id: 3,
    title: "We Build Hope",
    price: 150,
    image: "/placeholder.svg?height=100&width=80&text=We+Build+Hope+3",
    availability: "500 copies Available",
  },
]

export default function ShopPage() {
  const [viewMode, setViewMode] = useState("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("default")
  const [priceRange, setPriceRange] = useState([0, 150])
  const [currentPage, setCurrentPage] = useState(1)
  const [cartItems, setCartItems] = useState<number[]>([])

  const itemsPerPage = 9
  const totalItems = 15

  const filteredProducts = products.filter((product) => product.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const addToCart = (productId: number) => {
    setCartItems([...cartItems, productId])
  }

  const formatCurrency = (amount: number) => {
    return `₦${amount}`
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Mini Hero Section */}
        <section className="relative h-[300px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/previous-sunday-1-mvsBAuZ8fv6sQ9BIEJLOZ7sL3xWqBZ.png"
              alt="Shop Hero"
              fill
              className="object-cover brightness-[0.4]"
              priority
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

          <div className="relative h-full flex items-center justify-center text-center text-white px-4 pt-20">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Spiritual Books & Resources</h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Discover inspiring books that will strengthen your faith and deepen your relationship with God
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3">Explore Collection</Button>
            </div>
          </div>
        </section>

        {/* Breadcrumb */}
        <section className="bg-white border-b border-gray-200 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-primary font-medium">Shop</span>
            </div>
            <h2 className="text-xl font-semibold text-primary">Shop Now</h2>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                    {totalItems} results
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Default Sorting" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default Sorting</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="name">Name: A to Z</SelectItem>
                        <SelectItem value="newest">Newest First</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search Item"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-full sm:w-64"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "grid" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "list" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-sm text-gray-600">{filteredProducts.length} products found</div>
                </div>
              </div>

              {/* Products Grid */}
              <div
                className={`grid gap-6 ${
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/${product.id}`}
                    className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all duration-300 ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    <div
                      className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : "aspect-[3/4]"} overflow-hidden`}
                    >
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                      <Link
                        href="/checkout"
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                      >
                        <Button className="bg-primary hover:bg-primary/90 text-white" size="sm">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </Link>
                    </div>

                    <div className={`p-4 ${viewMode === "list" ? "flex-1 flex flex-col justify-center" : ""}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">Price: {formatCurrency(product.price)}</span>
                        {product.inStock && (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">In Stock</span>
                        )}
                      </div>
                      {viewMode === "list" && (
                        <p className="text-gray-600 text-sm mt-2">
                          Inspirational book that will strengthen your faith and deepen your relationship with God.
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="border-gray-300"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {[1, 2].map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 ${
                          currentPage === page ? "bg-primary text-white" : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    disabled={currentPage * itemsPerPage >= totalItems}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="border-gray-300"
                  >
                    Next page
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Filter by Price */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wide">Filter by Price</h3>

                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={150}
                      min={0}
                      step={10}
                      className="w-full"
                    />

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Price: {formatCurrency(priceRange[0])}</span>
                      <span>{formatCurrency(priceRange[1])}</span>
                    </div>

                    <Button
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                      onClick={() => {
                        /* Apply filter logic */
                      }}
                    >
                      Filter
                    </Button>
                  </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wide">Top Product</h3>

                  <div className="space-y-4">
                    {topProducts.map((product) => (
                      <div key={product.id} className="flex gap-3 group">
                        <div className="relative w-16 h-20 flex-shrink-0 rounded-md overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors cursor-pointer">
                            {product.title}
                          </h4>
                          <p className="text-sm font-semibold text-primary mb-1">
                            Price: {formatCurrency(product.price)}
                          </p>
                          <p className="text-xs text-gray-500">{product.availability}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wide">Categories</h3>

                  <div className="space-y-2">
                    {[
                      { name: "Books", count: 15 },
                      { name: "Audio Books", count: 8 },
                      { name: "Devotionals", count: 12 },
                      { name: "Study Guides", count: 6 },
                      { name: "Children's Books", count: 4 },
                    ].map((category) => (
                      <div
                        key={category.name}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <Link
                          href={`/shop?category=${category.name.toLowerCase()}`}
                          className="text-gray-700 hover:text-primary transition-colors"
                        >
                          {category.name}
                        </Link>
                        <span className="text-sm text-gray-500">({category.count})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured Product */}
                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-lg p-6 text-white">
                  <h3 className="font-bold mb-2">Featured Book</h3>
                  <p className="text-sm text-white/90 mb-4">
                    "Listen Believe" - A powerful collection of faith-building messages
                  </p>
                  <Link href="/checkout">
                    <Button className="bg-primary hover:bg-primary/90 text-white">Purchase Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
