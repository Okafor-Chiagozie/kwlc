// Base interfaces (reusing from user types)
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

export interface PaginatedRequest {
  pageSize: number;
  pageNumber: number;
  searchParams?: Record<string, string>;
}

// Branch related interfaces
export interface CreateOrUpdateBranchRequest {
  id: number | null;
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

export interface Branch {
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

export interface GetAllBranchesRequest extends PaginatedRequest {}

export interface GetAllBranchesResponse extends StandardApiResponse<Branch[]> {
  totalCount: number;
  totalPages: number;
}

export interface GetBranchDetailsResponse extends StandardApiResponse<Branch[]> {}

export interface CreateOrUpdateBranchResponse extends StandardApiResponse<number[]> {}

export interface DeleteBranchResponse extends StandardApiResponse<Branch[]> {}

// Branch Images interfaces
export interface CreateOrUpdateBranchImagesRequest {
  id: number | null;
  file: string[];
  imageTitle: string;
  categoryId: "CarouselImage" | string;
  branchId: number;
}

export interface BranchImage {
  id: number;
  imageUrl: string;
  imageTitle: string;
  imageName: string;
  imageCategory: string;
  imageCategoryId: "CarouselImage" | string;
  branchId: number;
}

export interface CreateOrUpdateBranchImagesResponse extends StandardApiResponse<Branch[]> {}

export interface GetBranchImagesResponse extends StandardApiResponse<BranchImage[]> {}

export interface GetBranchImageResponse extends StandardApiResponse<Branch[]> {}

export interface DeleteBranchImageResponse extends StandardApiResponse<Branch[]> {}

// Weekly Activity interfaces
export interface TimeOnly {
  hour: number;
  minute: number;
  second?: number;
  millisecond?: number;
  microsecond?: number;
  nanosecond?: number;
  ticks?: number;
}

export interface CreateOrUpdateWeeklyActivityRequest {
  id: number | null;
  name: string;
  description: string;
  day: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  startTime: TimeOnly;
  closeTime: TimeOnly;
  weeklyActivityTypeId: "BibleStudy" | string;
  branchId: number;
}

export interface WeeklyActivity {
  id: number;
  name: string;
  description: string;
  day: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  startTime: TimeOnly;
  closeTime: TimeOnly;
  weeklyActivityTypeId: "BibleStudy" | string;
  branchId: number;
  isDeleted: boolean;
  dateDeleted?: string;
}

export interface CreateOrUpdateWeeklyActivityResponse extends StandardApiResponse<number[]> {}

export interface GetWeeklyActivityResponse extends StandardApiResponse<WeeklyActivity[]> {}

export interface DeleteWeeklyActivityResponse extends StandardApiResponse<number[]> {}

export interface GetWeeklyActivitiesResponse extends StandardApiResponse<number[]> {}

// Branch Report interfaces
export interface Attendance {
  id: number;
  branchReportId: number;
  totalCount: number;
  menCount: number;
  womenCount: number;
  childrenCount: number;
  teenagersCount: number;
  recordedBy: string;
}

export interface FinancialRecord {
  id: number;
  branchReportId: number;
  totalAmount: number;
  branchId: number;
  paymentMethodId: "Cash" | string;
  paymentChannelId: "Fincra" | string;
  paymentTypeId: "NormalOffering" | string;
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

export interface CreateBranchReportRequest {
  id: number;
  branchId: number;
  preacher: string;
  topic: string;
  programme: string;
  venue: string;
  reportWeek: string;
  recordUpdatedBy: string;
  attendance: Attendance;
  financialRecord: FinancialRecord;
}

export interface UpdateBranchReportRequest extends CreateBranchReportRequest {}

export interface BranchReport {
  id: number;
  branchId: number;
  preacher: string;
  topic: string;
  programme: string;
  venue: string;
  reportWeek: string;
  recordUpdatedBy: string;
  attendance: Attendance;
  financialRecord: FinancialRecord;
}

export interface GetBranchReportsRequest extends PaginatedRequest {}

export interface CreateBranchReportResponse extends StandardApiResponse<number[]> {}

export interface UpdateBranchReportResponse extends StandardApiResponse<number[]> {}

export interface GetBranchReportsResponse extends StandardApiResponse<BranchReport[]> {}

export interface GetBranchReportResponse extends StandardApiResponse<BranchReport[]> {}

export interface DeleteBranchReportResponse extends StandardApiResponse<number[]> {}