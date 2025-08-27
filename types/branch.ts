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

// Enums based on API documentation
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

export enum WeeklyActivityTypes {
  BibleStudy = "BibleStudy",
  Fellowship = "Fellowship"
}

export enum PaymentMethod {
  Card = "card",
  BankTransfer = "bank_transfer",
  Cash = "cash"
}

export enum PaymentChannel {
  Fincra = "Fincra"
}

export enum PaymentType {
  NormalOffering = "NormalOffering",
  TestimonyOffering = "TestimonyOffering",
  TitheOffering = "TitheOffering",
  SeedFaith = "SeedFaith",
  SpecialThanksgiving = "SpecialThanksgiving",
  ChildDedication = "ChildDedication",
  Others = "Others"
}

// Time interface from API
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

// AddBranchViewModel from API
export interface AddBranchViewModel {
  id?: number | null;
  name: string;
  stateId: number;
  lgaId: number;
  countryId: number;
  phoneNumber: string;
  email: string;
  address: string;
  location: string;
  welcomeAddress: string;
}

// BranchViewModel from API
export interface BranchViewModel {
  id: number;
  name: string;
  lgaId: number;
  lga: string;
  stateId: number;
  state: string;
  email: string;
  countryId: number;
  country: string;
  address: string;
  location: string;
  isDeleted: boolean;
  phoneNumber: string;
  dateCreated: string;
  imageUrl: string;
  welcomeAddress: string;
  dateDeleted?: string;
}

// BranchImageRequestViewModel from API
export interface BranchImageRequestViewModel {
  file: File[];
  categoryId: ImageCategory;
  branchId: number;
}

// UpdateImageRequest from API
export interface UpdateImageRequest {
  id: number;
  file: File;
}

// BranchImageViewModel from API
export interface BranchImageViewModel {
  id: number;
  imageUrl: string;
  imageName: string;
  imageCategory: string;
  imageCategoryId: ImageCategory;
  branchId: number;
}

// AddWeeklyActivityViewModel from API
export interface AddWeeklyActivityViewModel {
  id?: number | null;
  name: string;
  description: string;
  day: DayOfWeek;
  startTime: TimeOnly;
  closeTime: TimeOnly;
  weeklyActivityTypeId: WeeklyActivityTypes;
  branchId: number;
}

// WeeklyActivityViewModel from API
export interface WeeklyActivityViewModel {
  id: number;
  name: string;
  description: string;
  day: DayOfWeek;
  startTime: TimeOnly;
  closeTime: TimeOnly;
  weeklyActivityTypeId: WeeklyActivityTypes;
  branchId: number;
  isDeleted: boolean;
  dateDeleted?: string;
}

// AttendanceViewModel from API
export interface AttendanceViewModel {
  id: number;
  branchReportId: number;
  totalCount: number;
  menCount: number;
  womenCount: number;
  childrenCount: number;
  teenagersCount: number;
  recordedBy: string;
}

// FinancialRecordViewModel from API
export interface FinancialRecordViewModel {
  id?: number | null;
  branchReportId: number;
  totalAmount: number;
  branchId: number;
  paymentMethodId: PaymentMethod;
  paymentChannelId: PaymentChannel;
  paymentTypeId: PaymentType;
  recordedBy: string;
  normalOffering: number;
  testimonyOffering: number;
  titheOffering: number;
  seedFaith: number;
  specialThanksgiving: number;
  childDedication: number;
  others: number;
  lga: string;
  state: string;
  branch: string;
  address: string;
  country: string;
  isDeleted: boolean;
  updatedBy: string;
  dateDeleted?: string;
}

// AddBranchReportViewModel from API
export interface AddBranchReportViewModel {
  id?: number | null;
  branchId: number;
  preacher: string;
  topic: string;
  programme: string;
  venue: string;
  reportWeek: string; // DateTime in API
  recordUpdatedBy: string;
  attendance: AttendanceViewModel;
  financialRecord: FinancialRecordViewModel;
}

// BranchReportViewModel from API
export interface BranchReportViewModel {
  id?: number | null;
  branchId: number;
  preacher: string;
  topic: string;
  programme: string;
  venue: string;
  reportWeek: string;
  recordUpdatedBy: string;
  attendance: AttendanceViewModel;
  financialRecord: FinancialRecordViewModel;
}

// Request types
export type CreateOrUpdateBranchRequest = AddBranchViewModel;
export type GetAllBranchesRequest = SearchFilter;
export type CreateBranchImagesRequest = BranchImageRequestViewModel;
export type UpdateBranchImagesRequest = UpdateImageRequest;
export type CreateOrUpdateWeeklyActivityRequest = AddWeeklyActivityViewModel;
export type CreateBranchReportRequest = AddBranchReportViewModel;
export type UpdateBranchReportRequest = AddBranchReportViewModel;
export type GetBranchReportsRequest = SearchFilter;

// Response types based on API documentation
export interface Int32ListResult extends StandardApiResponse<number[]> {}
export interface Int32Result extends StandardApiResponse<number> {}
export interface BranchViewModelListResult extends PaginatedApiResponse<BranchViewModel[]> {}
export interface BranchImageViewModelListResult extends StandardApiResponse<BranchImageViewModel[]> {}
export interface WeeklyActivityViewModelListResult extends StandardApiResponse<WeeklyActivityViewModel[]> {}
export interface BranchReportViewModelListResult extends StandardApiResponse<BranchReportViewModel[]> {}

// Response interfaces matching API exactly
export interface CreateOrUpdateBranchResponse extends Int32ListResult {}
export interface GetAllBranchesResponse extends BranchViewModelListResult {}
export interface GetBranchDetailsResponse extends BranchViewModelListResult {}
export interface GetBranchesLocationsResponse extends BranchViewModelListResult {}
export interface DeleteBranchResponse extends BranchViewModelListResult {}

export interface CreateBranchImagesResponse extends BranchImageViewModelListResult {}
export interface UpdateBranchImagesResponse extends BranchImageViewModelListResult {}
export interface GetBranchImagesResponse extends BranchImageViewModelListResult {}
export interface GetBranchImageResponse extends BranchImageViewModelListResult {}
export interface DeleteBranchImageResponse extends Int32Result {}

export interface CreateOrUpdateWeeklyActivityResponse extends Int32ListResult {}
export interface GetWeeklyActivityResponse extends WeeklyActivityViewModelListResult {}
export interface GetWeeklyActivitiesResponse extends Int32ListResult {}
export interface GetAllWeeklyActivitiesResponse extends Int32ListResult {}
export interface DeleteWeeklyActivityResponse extends Int32ListResult {}

export interface CreateBranchReportResponse extends Int32ListResult {}
export interface UpdateBranchReportResponse extends Int32ListResult {}
export interface GetBranchReportsResponse extends BranchReportViewModelListResult {}
export interface GetBranchReportResponse extends BranchReportViewModelListResult {}
export interface DeleteBranchReportResponse extends Int32ListResult {}

// Type alias for convenience
export type Branch = BranchViewModel