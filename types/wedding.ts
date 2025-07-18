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
export enum DayOfWeek {
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday", 
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday"
}

export enum ImageCategory {
  CarouselImage = "CarouselImage",
  GalleryImages = "GalleryImages",
  PreviewImage = "PreviewImage",
  ThumbnailImage = "ThumbnailImage",
  Headshots = "Headshots",
  TicketImage = "TicketImage"
}

// Date and Time interfaces from API
export interface DateOnly {
  year: number;
  month: number;
  day: number;
  dayOfWeek: DayOfWeek;
  dayOfYear: number;
  dayNumber: number;
}

export interface TimeOnly {
  hour: number;
  minute: number;
  second?: number;
  millisecond?: number;
  microsecond?: number;
  nanosecond?: number;
  ticks?: number;
}

// Request/Response schemas exactly as defined in API documentation

// AddWeddingViewModel from API
export interface AddWeddingViewModel {
  id?: number | null;
  bride: string;
  groom: string;
  branchId?: number | null;
  address: string;
  venue: string;
  description: string;
  date: DateOnly;
  startTime: TimeOnly;
  closeTime: TimeOnly;
}

// EventViewModel from API (used in wedding responses)
export interface EventViewModel {
  id: number;
  name: string;
  date: string;
  startTime: string;
  closeTime: string;
  branchId?: number | null;
  eventTypeId: number;
  fee?: number | null;
  maxAttendance?: number | null;
  description: string;
  location: string;
  address: string;
  venue: string;
  isDeleted: boolean;
  eventType: string;
  imageUrl: string;
  price: string;
  attendanceCount: number;
  attendees: string;
  dateDeleted?: string;
}

// WeddingResponseViewModel from API
export interface WeddingResponseViewModel {
  id?: number | null;
  bride: string;
  groom: string;
  branchId?: number | null;
  address: string;
  branchName: string;
  venue: string;
  description: string;
  date: string;
  startTime: string;
  closeTime: string;
  galleryImages: string[];
  previewImages: string[];
  thumbnailImageUrl: string;
}

// WeddingImageViewModel from API
export interface WeddingImageViewModel {
  id: number;
  weddingId: number;
  imageUrl: string;
  imageName: string;
  imageTitle: string;
  imageCategoryId: ImageCategory;
}

// EventImageViewModel from API (used in some wedding image responses)
export interface EventImageViewModel {
  eventId: number;
  file: File[];
  imageCategoryId: ImageCategory;
  imageUrl: string;
  imageName: string;
}

// Request types
export type CreateOrUpdateWeddingRequest = AddWeddingViewModel;
export type GetAllWeddingsRequest = SearchFilter;
export type CreateWeddingImageRequest = {
  WeddingId: number;
  ImageCategoryId: ImageCategory;
  File: File[];
};
export type UpdateWeddingImageRequest = {
  Id: number;
  file: File;
};

// Response types based on API documentation
export interface Int32Result extends StandardApiResponse<number> {}
export interface EventViewModelListPaginationResult extends PaginatedApiResponse<EventViewModel[]> {}
export interface WeddingResponseViewModelListResult extends StandardApiResponse<WeddingResponseViewModel[]> {}
export interface WeddingImageViewModelResult extends StandardApiResponse<WeddingImageViewModel> {}
export interface EventImageViewModelListResult extends StandardApiResponse<EventImageViewModel[]> {}
export interface EventImageViewModelResult extends StandardApiResponse<EventImageViewModel> {}

// Response interfaces matching API exactly
export interface CreateOrUpdateWeddingResponse extends EventViewModel {}
export interface GetAllWeddingsResponse extends EventViewModelListPaginationResult {}
export interface GetWeddingResponse extends WeddingResponseViewModelListResult {}
export interface DeleteWeddingResponse extends Int32Result {}
export interface CreateWeddingImageResponse extends WeddingImageViewModelResult {}
export interface UpdateWeddingImageResponse extends EventImageViewModelResult {}
export interface GetWeddingImagesResponse extends EventImageViewModelListResult {}
export interface GetWeddingImageResponse extends EventImageViewModelResult {}
export interface DeleteWeddingImageResponse extends Int32Result {}