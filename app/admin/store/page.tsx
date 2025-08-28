"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Plus, Edit, Trash2, Download, Image as ImageIcon, Loader2, DollarSign, TrendingUp, Package } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import ProtectedRoute from "@/components/admin/protected-route"
import { toast } from "sonner"
import {
  addBook,
  updateBook,
  getBooks,
  getBook,
  getBookSummary,
  deleteBook
} from "@/services/book"
import {
  AddBookRequest,
  UpdateBookRequest,
  GetBooksRequest,
  BookViewModel,
  BookCategory
} from "@/types/book"

export default function AdminStorePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Books State
  const [books, setBooks] = useState<BookViewModel[]>([])
  const [bookStats, setBookStats] = useState<any>(null)
  
  // New Book Form State
  const [newBook, setNewBook] = useState<AddBookRequest>({
    title: "",
    description: "",
    author: "",
    price: 0,
    categoryId: BookCategory.ChristianLiving,
    file: undefined,
    image: undefined
  })

  // Edit States
  const [editingBook, setEditingBook] = useState<UpdateBookRequest | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  
  // Delete States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<string | null>(null)

  // File inputs
  const [bookFile, setBookFile] = useState<File | null>(null)
  const [bookImage, setBookImage] = useState<File | null>(null)
  const [editBookFile, setEditBookFile] = useState<File | null>(null)
  const [editBookImage, setEditBookImage] = useState<File | null>(null)

  // Load initial data
  useEffect(() => {
    loadStoreData()
  }, [])

  const loadStoreData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const searchParams: GetBooksRequest = {
        pageSize: 100,
        pageNumber: 1,
        searchParams: {}
      }

      const [booksResponse, summaryResponse] = await Promise.all([
        getBooks(searchParams),
        getBookSummary().catch(() => ({ isSuccessful: false, data: null }))
      ])

      if (booksResponse.isSuccessful && booksResponse.data) {
        setBooks(booksResponse.data)
        console.log('Books loaded:', booksResponse.data)
      } else {
        const errorMessage = booksResponse.errors?.map(e => e.description).join(', ') || booksResponse.responseMessage
        throw new Error(errorMessage || 'Failed to load books')
      }

      if (summaryResponse.isSuccessful && summaryResponse.data) {
        setBookStats(summaryResponse.data[0] || {})
      }

    } catch (err: any) {
      console.error('Error loading store data:', err)
      setError('Failed to load store information')
      toast.error('Failed to load store information')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBook = async () => {
    try {
      // Validate required fields
      if (!newBook.title.trim() || !newBook.author.trim() || !newBook.description.trim()) {
        toast.error('Please fill in all required fields (Title, Author, Description)')
        return
      }

      setIsSaving(true)
      
      const bookData: AddBookRequest = {
        ...newBook,
        file: bookFile || undefined,
        image: bookImage || undefined
      }

      const response = await addBook(bookData)

      if (response.isSuccessful) {
        toast.success('Book created successfully!')
        
        // Reset form
        setNewBook({
          title: "",
          description: "",
          author: "",
          price: 0,
          categoryId: BookCategory.ChristianLiving,
          file: undefined,
          image: undefined
        })
        setBookFile(null)
        setBookImage(null)
        
        // Reset file inputs
        const fileInput = document.getElementById('book-file') as HTMLInputElement
        const imageInput = document.getElementById('book-image') as HTMLInputElement
        if (fileInput) fileInput.value = ''
        if (imageInput) imageInput.value = ''
        
        // Reload data
        loadStoreData()
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || response.responseMessage
        throw new Error(errorMessage || 'Failed to create book')
      }
    } catch (err: any) {
      console.error('Error creating book:', err)
      toast.error(err.message || 'Failed to create book')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateBook = async () => {
    try {
      if (!editingBook) return

      setIsSaving(true)
      
      const bookData: UpdateBookRequest = {
        ...editingBook,
        file: editBookFile || undefined,
        image: editBookImage || undefined
      }

      const response = await updateBook(bookData)

      if (response.isSuccessful) {
        toast.success('Book updated successfully!')
        setIsEditDialogOpen(false)
        setEditingBook(null)
        setEditBookFile(null)
        setEditBookImage(null)
        loadStoreData()
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || response.responseMessage
        throw new Error(errorMessage || 'Failed to update book')
      }
    } catch (err: any) {
      console.error('Error updating book:', err)
      toast.error(err.message || 'Failed to update book')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteBook = async (bookId: string) => {
    try {
      const response = await deleteBook(Number(bookId))

      if (response.isSuccessful) {
        toast.success('Book deleted successfully!')
        setDeleteDialogOpen(false)
        setBookToDelete(null)
        loadStoreData()
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || response.responseMessage
        throw new Error(errorMessage || 'Failed to delete book')
      }
    } catch (err: any) {
      console.error('Error deleting book:', err)
      toast.error(err.message || 'Failed to delete book')
    }
  }

  const openDeleteDialog = (bookId: string) => {
    setBookToDelete(bookId)
    setDeleteDialogOpen(true)
  }

  const startEditBook = (book: BookViewModel) => {
    setEditingBook({
      id: Number(book.id),
      title: book.title,
      description: book.description,
      author: book.author,
      price: book.price,
      bookCategoryId: book.categoryId,
      file: undefined,
      image: undefined
    })
    setIsEditDialogOpen(true)
  }

  const getCategoryDisplay = (category: BookCategory): string => {
    const categoryMap = {
      [BookCategory.ChristianLiving]: 'Christian Living',
      [BookCategory.Devotional]: 'Devotional',
      [BookCategory.Theology]: 'Theology',
      [BookCategory.BibleStudy]: 'Bible Study',
      [BookCategory.ChristianFiction]: 'Christian Fiction',
      [BookCategory.BiographyOrTestimony]: 'Biography/Testimony',
      [BookCategory.SpiritualGrowth]: 'Spiritual Growth',
      [BookCategory.Apologetics]: 'Apologetics',
      [BookCategory.CounselingOrInnerHealing]: 'Counseling/Inner Healing',
      [BookCategory.MarriageAndFamily]: 'Marriage & Family',
      [BookCategory.WomensInterest]: 'Women\'s Interest',
      [BookCategory.MensInterest]: 'Men\'s Interest',
      [BookCategory.YouthOrTeen]: 'Youth/Teen',
      [BookCategory.ProphecyOrEndTimes]: 'Prophecy/End Times',
      [BookCategory.MinistryOrChurchLeadership]: 'Ministry/Church Leadership',
      [BookCategory.Worship]: 'Worship'
    }
    return categoryMap[category] || category
  }

  const formatCurrency = (amount: number): string => {
    return amount === 0 ? 'FREE' : `₦${amount.toLocaleString()}`
  }

  // Calculate statistics
  const totalBooks = books.length
  const freeBooks = books.filter(b => b.price === 0).length
  const paidBooks = books.filter(b => b.price > 0).length
  const averagePrice = paidBooks > 0 ? books.filter(b => b.price > 0).reduce((sum, b) => sum + b.price, 0) / paidBooks : 0

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading store information...</span>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <h1 className="text-xl sm:text-2xl font-bold">Store Management</h1>
            <Button 
              onClick={loadStoreData} 
              disabled={isLoading}
              variant="outline"
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <BookOpen className="h-4 w-4 mr-2" />
              )}
              Refresh Data
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                <BookOpen className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBooks}</div>
                <p className="text-xs text-muted-foreground">All books</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Free Books</CardTitle>
                <Package className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{freeBooks}</div>
                <p className="text-xs text-muted-foreground">No cost</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid Books</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{paidBooks}</div>
                <p className="text-xs text-muted-foreground">Premium content</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(averagePrice)}
                </div>
                <p className="text-xs text-muted-foreground">Average pricing</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all-books" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 h-auto">
              <TabsTrigger value="all-books" className="text-xs sm:text-sm">All Books</TabsTrigger>
              <TabsTrigger value="add-book" className="text-xs sm:text-sm">Add Book</TabsTrigger>
              <TabsTrigger value="sales" className="text-xs sm:text-sm">Sales Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="all-books" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <Card key={book.id} className="overflow-hidden">
                    <div className="relative aspect-[3/4] bg-gray-100">
                      {book.imageUrl ? (
                        <img 
                          src={book.imageUrl} 
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge variant={book.price === 0 ? "secondary" : "default"}>
                          {formatCurrency(book.price)}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg line-clamp-2">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">by {book.author}</p>
                        <Badge variant="outline" className="text-xs">
                          {getCategoryDisplay(book.categoryId)}
                        </Badge>
                        <p className="text-sm text-muted-foreground line-clamp-3">{book.description}</p>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startEditBook(book)}
                          className="flex-1"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        {book.bookUrl && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(book.bookUrl, '_blank')}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => openDeleteDialog(book.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {books.length === 0 && (
                  <div className="col-span-full">
                    <Card>
                      <CardContent className="text-center py-12">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No books found</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="add-book" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Book</CardTitle>
                  <p className="text-sm text-muted-foreground">Create a new book in the store</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="book-title">Book Title *</Label>
                        <Input 
                          id="book-title" 
                          placeholder="Enter book title"
                          value={newBook.title}
                          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="book-author">Author *</Label>
                        <Input 
                          id="book-author" 
                          placeholder="Enter author name"
                          value={newBook.author}
                          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="book-price">Price</Label>
                        <Input 
                          id="book-price" 
                          type="number"
                          placeholder="0 for free books"
                          value={newBook.price}
                          onChange={(e) => setNewBook({ ...newBook, price: Number(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="book-category">Category</Label>
                        <Select 
                          value={newBook.categoryId} 
                          onValueChange={(value) => setNewBook({ ...newBook, categoryId: value as BookCategory })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(BookCategory).map(category => (
                              <SelectItem key={category} value={category}>
                                {getCategoryDisplay(category)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="book-description">Description *</Label>
                        <Textarea 
                          id="book-description" 
                          placeholder="Enter book description" 
                          rows={4}
                          value={newBook.description}
                          onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="book-file">Book File (PDF)</Label>
                        <Input 
                          id="book-file" 
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setBookFile(e.target.files?.[0] || null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="book-image">Book Cover Image</Label>
                        <Input 
                          id="book-image" 
                          type="file"
                          accept="image/*"
                          onChange={(e) => setBookImage(e.target.files?.[0] || null)}
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleCreateBook}
                    disabled={isSaving}
                    className="w-full"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Book...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Book
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sales" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Reports</CardTitle>
                  <p className="text-sm text-muted-foreground">Book sales and download statistics</p>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Sales reports coming soon</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      This section will show book purchase analytics and download statistics
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Edit Book Dialog */}
          {isEditDialogOpen && editingBook && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 !mt-0">
              <Card className="w-full max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Edit Book</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Book Title</Label>
                      <Input
                        value={editingBook.title}
                        onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Author</Label>
                      <Input
                        value={editingBook.author}
                        onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        value={editingBook.price}
                        onChange={(e) => setEditingBook({ ...editingBook, price: Number(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select 
                        value={editingBook.bookCategoryId} 
                        onValueChange={(value) => setEditingBook({ ...editingBook, bookCategoryId: value as BookCategory })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(BookCategory).map(category => (
                            <SelectItem key={category} value={category}>
                              {getCategoryDisplay(category)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={editingBook.description}
                      onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Update Book File</Label>
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setEditBookFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    <div>
                      <Label>Update Cover Image</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditBookImage(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleUpdateBook} disabled={isSaving} className="flex-1">
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Book'
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditDialogOpen(false)
                        setEditingBook(null)
                        setEditBookFile(null)
                        setEditBookImage(null)
                      }}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Delete Book Confirmation Modal */}
          {deleteDialogOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 !mt-0">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle className="text-red-600">Delete Book</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Are you sure you want to delete this book? This action cannot be undone.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDeleteDialogOpen(false)
                        setBookToDelete(null)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (bookToDelete) {
                          handleDeleteBook(bookToDelete)
                        }
                      }}
                    >
                      Delete Book
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
} 