// Base interfaces
export interface ApiError {
  field: string;
  description: string;
}

export interface StandardApiResponse<T = any> {
  data: T;
  isSuccessful: boolean;
  errors: ApiError[];
  responseMessage: string;
  responseCode: string;
}

export interface PaginatedApiResponse<T = any> extends StandardApiResponse<T> {
  totalCount: number;
  totalPages: number;
}

export interface SearchFilter {
  pageSize: number;
  pageNumber: number;
  searchParams?: Record<string, string>;
}

// Enums from API documentation
export enum BookCategory {
  ChristianLiving = "ChristianLiving",
  Devotional = "Devotional",
  Theology = "Theology",
  BibleStudy = "BibleStudy",
  ChristianFiction = "ChristianFiction",
  BiographyOrTestimony = "BiographyOrTestimony",
  SpiritualGrowth = "SpiritualGrowth",
  Apologetics = "Apologetics",
  CounselingOrInnerHealing = "CounselingOrInnerHealing",
  MarriageAndFamily = "MarriageAndFamily",
  WomensInterest = "WomensInterest",
  MensInterest = "MensInterest",
  YouthOrTeen = "YouthOrTeen",
  ProphecyOrEndTimes = "ProphecyOrEndTimes",
  MinistryOrChurchLeadership = "MinistryOrChurchLeadership",
  Worship = "Worship"
}

// Request/Response schemas exactly as defined in API documentation

// AddBookViewModel from API
export interface AddBookViewModel {
  title: string;
  description: string;
  author: string;
  price: number;
  file?: File;
  image?: File;
  categoryId: BookCategory;
}

// UpdateBookViewModel from API
export interface UpdateBookViewModel {
  id: number;
  title: string;
  description: string;
  author: string;
  price: number;
  file?: File;
  image?: File;
  bookCategoryId: BookCategory;
}

// BookViewModel from API
export interface BookViewModel {
  id: string;
  title: string;
  author: string;
  price: number;
  bookUrl: string;
  imageUrl: string;
  bookName: string;
  category: string;
  imageName: string;
  description: string;
  priceDisplay: string;
  categoryId: BookCategory;
}

// Enums from API (Swagger components)
export type Currency =
  | "NGN"
  | "USD"
  | "EUR"
  | "GBP"
  | "CAD"
  | "AUD"
  | "JPY"
  | "CNY"
  | "INR"
  | "ZAR";

export type PaymentMethod = "card" | "bank_transfer" | "cash";

// AddBookOrderViewModel from API
export interface AddBookOrderViewModel {
  name?: string | null;
  customerEmail?: string | null;
  bookIds?: number[] | null;
  currency: Currency;
  paymentMethodId: PaymentMethod;
}

// OrderItemViewModel from API
export interface OrderItemViewModel {
  id: number;
  bookId: number;
  title: string;
  author: string;
  imageUrl: string;
  downloadUrl: string;
  bookPurchaseId: string;
  bookCategory: string;
  priceAtPurchase: number;
  bookCategoryId: BookCategory;
}

// BookPurchaseViewModel from API
export interface BookPurchaseViewModel {
  id: string;
  bookId: number;
  emailSent: boolean;
  name: string;
  paymentStatus: boolean;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  customerEmail: string;
  items: OrderItemViewModel[];
  paymentReference: string;
}

// BookPurchaseReportSummary from API
export interface BookPurchaseReportSummary {
  bookId: number;
  title: string;
  numberOfBooks: number;
  price: number;
}

// BookPurchaseReportSummaryResponse from API
export interface BookPurchaseReportSummaryResponse {
  groupId: number;
  group: string;
  summary: BookPurchaseReportSummary[];
  numberOfBooks: number;
  totalAmount: number;
}

// BookPurchaseSummary from API
export interface BookPurchaseSummary {
  categorySummary: BookPurchaseReportSummaryResponse[];
  bookSummary: BookPurchaseReportSummaryResponse[];
  priceSummary: BookPurchaseReportSummaryResponse[];
  summary: BookPurchaseReportSummaryResponse[];
}

// Request types
export type AddBookRequest = AddBookViewModel;
export type UpdateBookRequest = UpdateBookViewModel;
export type GetBooksRequest = SearchFilter;
export type AddBookOrderRequest = AddBookOrderViewModel;
export type VerifyBookPurchaseRequest = string;
export type GetBookPurchasesRequest = SearchFilter;

// Response types based on API documentation
export interface Int32ListResult extends StandardApiResponse<number[]> {}
export interface BooleanResult extends StandardApiResponse<boolean> {}
export interface BookViewModelListResult extends StandardApiResponse<BookViewModel[]> {}
export interface BookPurchaseViewModelResult extends StandardApiResponse<BookPurchaseViewModel> {}
export interface BookPurchaseViewModelListPaginationResult extends PaginatedApiResponse<BookPurchaseViewModel[]> {}
export interface BookPurchaseSummaryResult extends StandardApiResponse<BookPurchaseSummary> {}

// Response interfaces matching API exactly
export interface AddBookResponse extends BookViewModelListResult {}
export interface UpdateBookResponse extends BookViewModelListResult {}
export interface GetBooksResponse extends BookViewModelListResult {}
export interface GetBookResponse extends BookViewModelListResult {}
export interface BookCategoryCountItem {
  group: string;
  numberOfBooks: number;
  groupId: string; // e.g., Devotional, SpiritualGrowth
}

export interface BookSummaryData {
  featuredBook?: BookViewModel | null;
  topBooksSummary?: BookViewModel[] | null;
  bookCategoryCount?: BookCategoryCountItem[] | null;
}

export interface GetBookSummaryResponse extends StandardApiResponse<BookSummaryData> {}
export interface DeleteBookResponse extends Int32ListResult {}

export interface InitiateOrderResponse extends StandardApiResponse<any> {}
export interface VerifyBookPurchaseResponse extends BookPurchaseViewModelResult {}
export interface GetBookPurchasesResponse extends BookPurchaseViewModelListPaginationResult {}
export interface GetBookPurchaseResponse extends BookPurchaseViewModelResult {}
export interface DeleteBookPurchaseResponse extends BooleanResult {}
