"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ShoppingCart, Grid, List, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import MainLayout from "@/components/main-layout"
import { useApi } from "@/hooks/useApi"
import { getBooks } from "@/services/book"
import { BookViewModel, BookCategory } from "@/types/book"
import { useCart } from "@/hooks/useCart"



const isNoRecordsError = (error: string | null) => {
  return error && error.toLowerCase().includes("no record found")
}

export default function ShopPage() {
  const [viewMode, setViewMode] = useState("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("default")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [currentPage, setCurrentPage] = useState(1)
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Cart functionality
  const { addToCart, getItemCount, isInCart, getCartItem } = useCart()

  // Fetch books from API
  const {
    data: booksResponse,
    loading: booksLoading,
    error: booksError,
    refetch: refetchBooks
  } = useApi(() => getBooks({
    pageSize: 100,
    pageNumber: 1,
    searchParams: searchQuery ? { search: searchQuery } : undefined
  }), [searchQuery])

  const books = booksResponse?.data || []
  const shouldShowError = booksError && !isNoRecordsError(booksError)

  const itemsPerPage = 9

  // Get unique categories from books
  const categories = [
    { name: "All", count: books.length },
    ...Object.values(BookCategory).map(category => ({
      name: category,
      count: books.filter(book => book.categoryId === category).length
    })).filter(cat => cat.count > 0)
  ]

  // Filter and sort books
  let filteredProducts = books.filter((book: BookViewModel) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = book.price >= priceRange[0] && book.price <= priceRange[1]
    const matchesCategory = categoryFilter === "all" || book.categoryId === categoryFilter
    
    return matchesSearch && matchesPrice && matchesCategory
  })

  // Apply sorting
  switch (sortBy) {
    case "price-low":
      filteredProducts = filteredProducts.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      filteredProducts = filteredProducts.sort((a, b) => b.price - a.price)
      break
    case "name":
      filteredProducts = filteredProducts.sort((a, b) => a.title.localeCompare(b.title))
      break
    case "free":
      filteredProducts = filteredProducts.filter(book => book.price === 0)
      break
    default:
      // Keep original order
      break
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  const handleAddToCart = (book: BookViewModel) => {
    addToCart(book)
    // You could add a toast notification here
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
                                  Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{" "}
              {filteredProducts.length} results
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
                        <SelectItem value="free">Free Books Only</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search books or authors..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          setCurrentPage(1) // Reset to first page when searching
                        }}
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

                  <div className="text-sm text-gray-600">
                    {filteredProducts.length} products found • Page {currentPage} of {totalPages}
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {booksLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-gray-600">Loading books...</p>
                </div>
              )}

              {/* Error State */}
              {shouldShowError && (
                <div className="text-center max-w-md mx-auto py-20">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Unable to Load Books</h2>
                  <p className="text-gray-600 mb-4">{booksError}</p>
                  <Button onClick={refetchBooks}>Try Again</Button>
                </div>
              )}

              {/* Empty State */}
              {!booksLoading && !shouldShowError && filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No books found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                  <Button onClick={() => {
                    setSearchQuery("")
                    setPriceRange([0, 1000])
                    setCategoryFilter("all")
                    setCurrentPage(1)
                  }}>Clear Filters</Button>
                </div>
              )}

              {/* Products Grid */}
              {!booksLoading && !shouldShowError && paginatedProducts.length > 0 && (
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                  }`}
                >
                {paginatedProducts.map((book: BookViewModel) => (
                  <Link
                    key={book.id}
                    href={`/shop/${book.id}`}
                    className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all duration-300 ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    <div
                      className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : "aspect-[3/4]"} overflow-hidden`}
                    >
                      <Image
                        src={book.imageUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"}
                        alt={book.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                      
                      {/* In Cart Badge */}
                      {isInCart(book.id) && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                          <ShoppingCart className="h-3 w-3" />
                          <span>{getCartItem(book.id)?.quantity}</span>
                        </div>
                      )}
                      
                      <Button
                        onClick={(e) => {
                          e.preventDefault()
                          handleAddToCart(book)
                        }}
                        className={`absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-300 transform bg-primary hover:bg-primary/90 text-white ${
                          isInCart(book.id) 
                            ? "opacity-100 translate-y-0" 
                            : "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                        }`}
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {isInCart(book.id) ? "Add More" : "Add to Cart"}
                      </Button>
                    </div>

                    <div className={`p-4 ${viewMode === "list" ? "flex-1 flex flex-col justify-center" : ""}`}>
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">{book.priceDisplay || `₦${book.price.toLocaleString()}`}</span>
                        <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">{book.category}</span>
                      </div>
                      {viewMode === "list" && book.description && (
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                          {book.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
                </div>
              )}

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
                    {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                      let page = index + 1
                      if (totalPages > 5 && currentPage > 3) {
                        page = currentPage - 2 + index
                        if (page > totalPages) page = totalPages - 4 + index
                      }
                      
                      return (
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
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    disabled={currentPage >= totalPages}
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
                      onValueChange={(value) => {
                        setPriceRange(value)
                        setCurrentPage(1) // Reset to first page when filter changes
                      }}
                      max={1000}
                      min={0}
                      step={50}
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
                    {books.slice(0, 3).map((book: BookViewModel) => (
                                              <div key={book.id} className="flex gap-3 group">
                          <div className="relative w-16 h-20 flex-shrink-0 rounded-md overflow-hidden">
                            <Image
                              src={book.imageUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"}
                              alt={book.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            
                            {/* Small In Cart Badge for Sidebar */}
                            {isInCart(book.id) && (
                              <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                {getCartItem(book.id)?.quantity}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors cursor-pointer">
                              {book.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                            <p className="text-sm font-semibold text-primary">
                              {book.priceDisplay || `₦${book.price.toLocaleString()}`}
                            </p>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Categories Filter */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wide">Categories</h3>
                  
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category.name}
                        className={`cursor-pointer p-2 rounded transition-colors ${
                          categoryFilter === (category.name === "All" ? "all" : category.name)
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setCategoryFilter(category.name === "All" ? "all" : category.name)
                          setCurrentPage(1) // Reset to first page when filter changes
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 hover:text-primary transition-colors">
                            {category.name}
                          </span>
                          <span className="text-sm text-gray-500">({category.count})</span>
                        </div>
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
