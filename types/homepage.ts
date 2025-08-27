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

export enum ChurchImageCategory {
  CarouselImage = "CarouselImage",
  FellowshipImage = "FellowshipImage",
  BibleStudyImage = "BibleStudyImage",
  CommunityImage = "CommunityImage",
  ChurchEventImage = "ChurchEventImage",
  ChurchServiceImage = "ChurchServiceImage",
  ChurchWeddingImage = "ChurchWeddingImage",
  ChurchLiveStreamImage = "ChurchLiveStreamImage"
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

// HomePage Response ViewModel (main homepage data)
export interface HomePageResponseViewModel {
  // Define based on actual API schema - this needs to be verified
  // For now using a generic structure
  data: any;
}

// AddChurchViewModel from API
export interface AddChurchViewModel {
  id?: number | null;
  name: string;
  email: string;
  address: string;
  location: string;
  phoneNumber: string;
  welcomeAddress: string;
}

// AddServiceScheduleViewModel from API
export interface AddServiceScheduleViewModel {
  id?: number | null;
  name: string;
  churchDays: AddChurchdayViewModel[];
}

// AddChurchdayViewModel from API
export interface AddChurchdayViewModel {
  id?: number | null;
  day: DayOfWeek;
  startTime: TimeOnly;
  closeTime: TimeOnly;
}

// ServiceScheduleViewModel from API (for responses)
export interface ServiceScheduleViewModel {
  id?: number | null;
  name: string;
  churchDays: ChurchdayViewModel[];
}

// ChurchdayViewModel from API (for responses)
export interface ChurchdayViewModel {
  id?: number | null;
  day: DayOfWeek;
  startTime: TimeOnly;
  closeTime: TimeOnly;
}

// ChurchImageViewModel from API
export interface ChurchImageViewModel {
  id?: number | null;
  imageUrl: string;
  imageName: string;
  imageCategoryId: ChurchImageCategory;
}

// ChurchImageResponseViewModel from API
export interface ChurchImageResponseViewModel {
  carouselImages: ChurchImageViewModel[];
  bibleStudyImage: ChurchImageViewModel;
  communityImage: ChurchImageViewModel;
  fellowshipImage: ChurchImageViewModel;
  weddingImage: ChurchImageViewModel;
  churchLivestreamImage: ChurchImageViewModel;
  churchEventImage: ChurchImageViewModel;
}

// Request types
export type CreateOrUpdateChurchDetailsRequest = AddChurchViewModel;
export type CreateOrUpdateServiceScheduleDetailsRequest = AddServiceScheduleViewModel;
export type CreateOrUpdateChurchdayDetailsRequest = AddChurchdayViewModel[];
export type CreateChurchImageRequest = {
  ImageCategoryId: ChurchImageCategory;
  File: File[];
};
export type UpdateChurchImageRequest = {
  Id: number;
  file: File;
};

// Response types based on exact API documentation
export interface HomePageResponseViewModelResult extends StandardApiResponse<HomePageResponseViewModel> {}
export interface Int32ListResult extends StandardApiResponse<number[]> {}
export interface Int32Result extends StandardApiResponse<number> {}
export interface ServiceScheduleViewModelListResult extends StandardApiResponse<ServiceScheduleViewModel[]> {}
export interface ChurchDayViewModelListResult extends StandardApiResponse<ChurchdayViewModel[]> {}
export interface ChurchImageViewModelResult extends StandardApiResponse<ChurchImageViewModel> {}
export interface ChurchImageResponseViewModelListResult extends StandardApiResponse<ChurchImageResponseViewModel[]> {}

// Response interfaces matching API exactly
export interface GetHomePageResponse extends HomePageResponseViewModelResult {}
export interface CreateOrUpdateChurchDetailsResponse extends Int32ListResult {}
export interface CreateOrUpdateServiceScheduleDetailsResponse extends Int32ListResult {}
export interface GetAllServiceSchedulesResponse extends ServiceScheduleViewModelListResult {}
export interface GetServiceScheduleResponse extends ServiceScheduleViewModelListResult {}
export interface DeleteServiceScheduleResponse extends Int32Result {}
export interface CreateOrUpdateChurchdayDetailsResponse extends Int32Result {}
export interface GetAllChurchdaysResponse extends ChurchDayViewModelListResult {}
export interface DeleteChurchDayResponse extends Int32Result {}
export interface CreateChurchImageResponse extends Int32Result {}
export interface UpdateChurchImageResponse extends ChurchImageViewModelResult {}
export interface GetChurchImagesResponse extends ChurchImageResponseViewModelListResult {}
export interface GetChurchImageResponse extends ChurchImageViewModelResult {}
export interface DeleteChurchImageResponse extends Int32ListResult {}